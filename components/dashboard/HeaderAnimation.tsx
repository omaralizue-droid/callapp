'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 180
    const height = container.clientHeight || 48

    // 1. Scene setup
    const scene = new THREE.Scene()
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 8

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 4. Create Globe (Particle Cloud)
    const particleCount = 120
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const globeRadius = 1.6
    const cyanColor = new THREE.Color('#22d3ee')
    const indigoColor = new THREE.Color('#6366f1')

    for (let i = 0; i < particleCount; i++) {
      // Uniform distribution on sphere
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      
      const x = globeRadius * Math.sin(phi) * Math.cos(theta)
      const y = globeRadius * Math.sin(phi) * Math.sin(theta)
      const z = globeRadius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Interleave cyan & indigo colors
      const mixRatio = Math.random()
      const mixedColor = new THREE.Color().lerpColors(cyanColor, indigoColor, mixRatio)
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const globe = new THREE.Points(geometry, material)
    scene.add(globe)

    // 5. Create Call Arcs (BPO routing lines)
    const lineCount = 5
    const arcs: THREE.Line[] = []
    const arcPointsList: THREE.Vector3[][] = []
    const pulseSpheres: THREE.Mesh[] = []

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    })

    const pulseGeom = new THREE.SphereGeometry(0.04, 8, 8)
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee })

    for (let i = 0; i < lineCount; i++) {
      // Select two random points on the globe
      const p1Idx = Math.floor(Math.random() * particleCount) * 3
      const p2Idx = Math.floor(Math.random() * particleCount) * 3

      const start = new THREE.Vector3(
        positions[p1Idx],
        positions[p1Idx + 1],
        positions[p1Idx + 2]
      )
      const end = new THREE.Vector3(
        positions[p2Idx],
        positions[p2Idx + 1],
        positions[p2Idx + 2]
      )

      // Calculate control point for curved arc
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const dist = start.distanceTo(end)
      mid.normalize().multiplyScalar(globeRadius + dist * 0.4) // pop arc outwards

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const points = curve.getPoints(24)
      arcPointsList.push(points)

      const lineGeom = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(lineGeom, lineMat)
      globe.add(line)
      arcs.push(line)

      // Add a moving pulse mesh along the arc
      const pulse = new THREE.Mesh(pulseGeom, pulseMat)
      globe.add(pulse)
      pulseSpheres.push(pulse)
    }

    // 6. Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / width - 0.5) * 0.5
      targetY = ((e.clientY - rect.top) / height - 0.5) * 0.5
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 7. Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Rotate globe slowly
      globe.rotation.y += 0.15 * delta
      globe.rotation.x += 0.05 * delta

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05
      globe.rotation.y += mouseX * 0.1
      globe.rotation.x += mouseY * 0.1

      // Pulse calls along BPO routing arcs
      pulseSpheres.forEach((pulse, idx) => {
        const points = arcPointsList[idx]
        // Calculate progress parameter (0 to 1) looping over time
        const speedMultiplier = 1.0 + idx * 0.2
        const progress = (time * 0.5 * speedMultiplier) % 1.0
        const pointIdx = Math.floor(progress * (points.length - 1))
        
        if (points[pointIdx]) {
          pulse.position.copy(points[pointIdx])
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      lineMat.dispose()
      pulseGeom.dispose()
      pulseMat.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-44 h-11 relative overflow-hidden rounded-lg bg-slate-950/20 border border-white/5 hidden lg:flex items-center justify-center"
      title="BPO Global Call Routing Nodes"
    >
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none select-none z-10">
        <span className="text-[8px] font-bold text-cyan-400 tracking-widest uppercase">Routing</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>
    </div>
  )
}
