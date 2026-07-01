'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface LandingHeroAnimationProps {
  theme: 'dark' | 'light'
}

export default function LandingHeroAnimation({ theme }: LandingHeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(0, 0, 15)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Colors matching the active light theme
    const connectionColor = new THREE.Color('#cbd5e1')

    // Create particles
    const particleCount = 280
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const lightColors = [
      new THREE.Color('#4f46e5'), // Indigo
      new THREE.Color('#818cf8'), // Light Indigo
      new THREE.Color('#a5b4fc'), // Soft Indigo
      new THREE.Color('#94a3b8'), // Slate
      new THREE.Color('#cbd5e1')  // Light Slate
    ]

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a 3D box
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      // Small velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      const randColor = lightColors[Math.floor(Math.random() * lightColors.length)]
      colors[i * 3] = randColor.r
      colors[i * 3 + 1] = randColor.g
      colors[i * 3 + 2] = randColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    })

    const particleSystem = new THREE.Points(geometry, pointsMaterial)
    scene.add(particleSystem)

    // Create line connection lines - lower opacity for clean look
    const lineMaterial = new THREE.LineBasicMaterial({
      color: connectionColor,
      transparent: true,
      opacity: 0.1,
    })

    let lineGeometry = new THREE.BufferGeometry()
    let lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lineSystem)

    // Mouse Tracking
    let mouse = new THREE.Vector2(-999, -999)
    let targetMouse = new THREE.Vector2(-999, -999)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      // Map to normalized device coordinates (-1 to 1)
      targetMouse.x = ((e.clientX - rect.left) / width) * 2 - 1
      targetMouse.y = -((e.clientY - rect.top) / height) * 2 + 1
    }

    const handleMouseLeave = () => {
      targetMouse.set(-999, -999)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()
      const delta = Math.min(clock.getDelta(), 0.1)

      // Get positions array
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
      const posArray = posAttr.array as Float32Array

      // Interpolate mouse smoothly
      if (targetMouse.x !== -999) {
        mouse.x += (targetMouse.x - mouse.x) * 0.1
        mouse.y += (targetMouse.y - mouse.y) * 0.1
      } else {
        mouse.set(-999, -999)
      }

      // Project mouse screen coords to 3D space
      let mouse3D = new THREE.Vector3()
      if (mouse.x !== -999) {
        mouse3D.set(mouse.x * 15, mouse.y * 9, 0)
      }

      // Update positions
      const linePositions: number[] = []

      for (let i = 0; i < particleCount; i++) {
        let x = posArray[i * 3]
        let y = posArray[i * 3 + 1]
        let z = posArray[i * 3 + 2]

        // Base velocity
        x += velocities[i * 3]
        y += velocities[i * 3 + 1]
        z += velocities[i * 3 + 2]

        // Apply a wave float
        y += Math.sin(time * 0.2 + x * 0.1) * 0.005

        // Boundary checks (wrap around)
        if (x > 18) x = -18
        if (x < -18) x = 18
        if (y > 11) y = -11
        if (y < -11) y = 11
        if (z > 6) z = -6
        if (z < -6) z = 6

        // Mouse hover interaction: push/pull particles near cursor
        if (mouse.x !== -999) {
          const dx = mouse3D.x - x
          const dy = mouse3D.y - y
          const dz = mouse3D.z - z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 4.5) {
            // Push particles away gently
            const force = (4.5 - dist) * 0.08
            x -= (dx / dist) * force
            y -= (dy / dist) * force
            z -= (dz / dist) * force
          }
        }

        posArray[i * 3] = x
        posArray[i * 3 + 1] = y
        posArray[i * 3 + 2] = z

        // Line connections calculation
        for (let j = i + 1; j < particleCount; j++) {
          const xj = posArray[j * 3]
          const yj = posArray[j * 3 + 1]
          const zj = posArray[j * 3 + 2]

          const dx = x - xj
          const dy = y - yj
          const dz = z - zj
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 3.2) {
            linePositions.push(x, y, z)
            linePositions.push(xj, yj, zj)
          }
        }
      }

      posAttr.needsUpdate = true

      // Update lines
      scene.remove(lineSystem)
      lineGeometry.dispose()
      lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )
      lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial)
      scene.add(lineSystem)

      // Rotate group slowly
      particleSystem.rotation.y = time * 0.02
      lineSystem.rotation.y = time * 0.02

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      pointsMaterial.dispose()
      lineMaterial.dispose()
      lineGeometry.dispose()
    }
  }, [theme])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-auto opacity-70"
    />
  )
}
