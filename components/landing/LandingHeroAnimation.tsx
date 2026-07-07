'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface LandingHeroAnimationProps {
  theme?: 'dark' | 'light'
}

export default function LandingHeroAnimation({ theme = 'dark' }: LandingHeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060a1a, 0.035)

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 200)
    camera.position.set(0, 0, 18)

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Star Field ─────────────────────────────────────────────
    const starCount = 1800
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    const starPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#67e8f9'),
      new THREE.Color('#f0abfc'),
    ]

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 120
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 80
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10
      const c = starPalette[Math.floor(Math.random() * starPalette.length)]
      starColors[i * 3]     = c.r
      starColors[i * 3 + 1] = c.g
      starColors[i * 3 + 2] = c.b
      starSizes[i] = Math.random() * 1.5 + 0.3
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Floating Orbs (Volumetric Glowing Spheres) ─────────────
    const orbData: Array<{
      mesh: THREE.Mesh
      velocity: THREE.Vector3
      basePos: THREE.Vector3
      phase: number
      speed: number
    }> = []

    const orbConfigs = [
      { radius: 2.2, color: 0x4f46e5, emissive: 0x3730a3, intensity: 2.5, x: -5,  y: 2,   z: -3 },
      { radius: 1.5, color: 0x7c3aed, emissive: 0x6d28d9, intensity: 3.0, x: 5,   y: -1,  z: -5 },
      { radius: 1.0, color: 0x06b6d4, emissive: 0x0891b2, intensity: 2.0, x: 2,   y: 4,   z: -8 },
      { radius: 0.7, color: 0xa855f7, emissive: 0x9333ea, intensity: 2.8, x: -7,  y: -3,  z: -6 },
      { radius: 0.5, color: 0x818cf8, emissive: 0x6366f1, intensity: 1.8, x: 7,   y: 3,   z: -2 },
      { radius: 0.4, color: 0x67e8f9, emissive: 0x22d3ee, intensity: 2.2, x: -3,  y: -5,  z: -4 },
      { radius: 1.8, color: 0x4338ca, emissive: 0x3730a3, intensity: 2.0, x: 0,   y: -4,  z: -10 },
    ]

    orbConfigs.forEach((cfg, i) => {
      const geo = new THREE.SphereGeometry(cfg.radius, 32, 32)
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: cfg.intensity,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      })
      const mesh = new THREE.Mesh(geo, mat)
      const bp = new THREE.Vector3(cfg.x, cfg.y, cfg.z)
      mesh.position.copy(bp)
      scene.add(mesh)

      orbData.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          0,
        ),
        basePos: bp.clone(),
        phase: i * (Math.PI * 2 / orbConfigs.length),
        speed: 0.4 + Math.random() * 0.4,
      })
    })

    // ── Connection Beams Between Orbs ──────────────────────────
    const beamMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.12,
    })
    let beamGeo = new THREE.BufferGeometry()
    let beamSystem = new THREE.LineSegments(beamGeo, beamMat)
    scene.add(beamSystem)

    // ── Main Network Particles ──────────────────────────────────
    const netCount = 320
    const netGeo = new THREE.BufferGeometry()
    const netPos = new Float32Array(netCount * 3)
    const netVel = new Float32Array(netCount * 3)
    const netColors = new Float32Array(netCount * 3)

    const netPalette = [
      new THREE.Color('#4f46e5'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#67e8f9'),
      new THREE.Color('#7c3aed'),
    ]

    for (let i = 0; i < netCount; i++) {
      netPos[i * 3]     = (Math.random() - 0.5) * 36
      netPos[i * 3 + 1] = (Math.random() - 0.5) * 22
      netPos[i * 3 + 2] = (Math.random() - 0.5) * 12
      netVel[i * 3]     = (Math.random() - 0.5) * 0.018
      netVel[i * 3 + 1] = (Math.random() - 0.5) * 0.018
      netVel[i * 3 + 2] = (Math.random() - 0.5) * 0.008
      const c = netPalette[Math.floor(Math.random() * netPalette.length)]
      netColors[i * 3]     = c.r
      netColors[i * 3 + 1] = c.g
      netColors[i * 3 + 2] = c.b
    }

    netGeo.setAttribute('position', new THREE.BufferAttribute(netPos, 3))
    netGeo.setAttribute('color', new THREE.BufferAttribute(netColors, 3))

    const netMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    })
    const netParticles = new THREE.Points(netGeo, netMat)
    scene.add(netParticles)

    // ── Network Connection Lines ────────────────────────────────
    const netLineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.08,
    })
    let netLineGeo = new THREE.BufferGeometry()
    let netLines = new THREE.LineSegments(netLineGeo, netLineMat)
    scene.add(netLines)

    // ── Lights ─────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x1a1a4e, 2.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x4f46e5, 8, 30)
    pointLight1.position.set(-4, 3, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x7c3aed, 6, 25)
    pointLight2.position.set(6, -2, 4)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0x06b6d4, 5, 20)
    pointLight3.position.set(0, 6, 3)
    scene.add(pointLight3)

    // ── Mouse Tracking ─────────────────────────────────────────
    let mouse = new THREE.Vector2(-999, -999)
    let targetMouse = new THREE.Vector2(-999, -999)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetMouse.x = ((e.clientX - rect.left) / width) * 2 - 1
      targetMouse.y = -((e.clientY - rect.top) / height) * 2 + 1
    }
    const handleMouseLeave = () => { targetMouse.set(-999, -999) }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // ── Resize ─────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation Loop ─────────────────────────────────────────
    let animationId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Smooth mouse interpolation
      if (targetMouse.x !== -999) {
        mouse.x += (targetMouse.x - mouse.x) * 0.05
        mouse.y += (targetMouse.y - mouse.y) * 0.05
      } else {
        mouse.set(-999, -999)
      }

      const mouse3D = new THREE.Vector3()
      if (mouse.x !== -999) {
        mouse3D.set(mouse.x * 16, mouse.y * 10, 0)
      }

      // ── Animate Orbs ──────────────────────────────────────────
      orbData.forEach((o, i) => {
        const { mesh, basePos, phase, speed } = o
        // Gentle sine float
        mesh.position.x = basePos.x + Math.sin(time * speed * 0.5 + phase) * 1.2
        mesh.position.y = basePos.y + Math.cos(time * speed * 0.4 + phase * 1.3) * 0.9
        mesh.position.z = basePos.z + Math.sin(time * speed * 0.3 + phase * 0.7) * 0.5
        // Mouse repel from orbs
        if (mouse.x !== -999) {
          const dx = mouse3D.x - mesh.position.x
          const dy = mouse3D.y - mesh.position.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 5) {
            const force = (5 - dist) * 0.015
            mesh.position.x -= dx / dist * force
            mesh.position.y -= dy / dist * force
          }
        }
        // Pulse emissive
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = orbConfigs[i].intensity + Math.sin(time * 1.5 + phase) * 0.5
        // Slow self-rotation
        mesh.rotation.x = time * 0.1 * (i % 2 === 0 ? 1 : -1)
        mesh.rotation.y = time * 0.15 + phase
      })

      // ── Beam Lines Between Orbs ──────────────────────────────
      const beamPositions: number[] = []
      for (let a = 0; a < orbData.length; a++) {
        for (let b = a + 1; b < orbData.length; b++) {
          const pa = orbData[a].mesh.position
          const pb = orbData[b].mesh.position
          const d = pa.distanceTo(pb)
          if (d < 10) {
            beamPositions.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z)
          }
        }
      }
      scene.remove(beamSystem)
      beamGeo.dispose()
      beamGeo = new THREE.BufferGeometry()
      if (beamPositions.length > 0) {
        beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamPositions, 3))
      }
      beamSystem = new THREE.LineSegments(beamGeo, beamMat)
      scene.add(beamSystem)

      // ── Animate Network Particles ────────────────────────────
      const netPosAttr = netGeo.getAttribute('position') as THREE.BufferAttribute
      const netPosArr = netPosAttr.array as Float32Array
      const netLinePositions: number[] = []

      for (let i = 0; i < netCount; i++) {
        let x = netPosArr[i * 3]
        let y = netPosArr[i * 3 + 1]
        let z = netPosArr[i * 3 + 2]

        x += netVel[i * 3]
        y += netVel[i * 3 + 1] + Math.sin(time * 0.25 + x * 0.08) * 0.004
        z += netVel[i * 3 + 2]

        // Wrap
        if (x > 20) x = -20
        if (x < -20) x = 20
        if (y > 13) y = -13
        if (y < -13) y = 13
        if (z > 8)  z = -8
        if (z < -8)  z = 8

        // Mouse push
        if (mouse.x !== -999) {
          const dx = mouse3D.x - x
          const dy = mouse3D.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 5) {
            const force = (5 - dist) * 0.06
            x -= dx / dist * force
            y -= dy / dist * force
          }
        }

        netPosArr[i * 3]     = x
        netPosArr[i * 3 + 1] = y
        netPosArr[i * 3 + 2] = z

        // Connection lines
        for (let j = i + 1; j < netCount; j++) {
          const xj = netPosArr[j * 3]
          const yj = netPosArr[j * 3 + 1]
          const zj = netPosArr[j * 3 + 2]
          const dx = x - xj, dy = y - yj, dz = z - zj
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < 3.5) {
            netLinePositions.push(x, y, z, xj, yj, zj)
          }
        }
      }

      netPosAttr.needsUpdate = true

      scene.remove(netLines)
      netLineGeo.dispose()
      netLineGeo = new THREE.BufferGeometry()
      if (netLinePositions.length > 0) {
        netLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(netLinePositions, 3))
      }
      netLines = new THREE.LineSegments(netLineGeo, netLineMat)
      scene.add(netLines)

      // ── Star parallax ────────────────────────────────────────
      stars.rotation.y = time * 0.008
      stars.rotation.x = time * 0.003

      // ── Camera subtle drift ───────────────────────────────────
      camera.position.x = mouse.x !== -999 ? mouse.x * 0.4 : Math.sin(time * 0.1) * 0.3
      camera.position.y = mouse.y !== -999 ? mouse.y * 0.3 : Math.cos(time * 0.08) * 0.2
      camera.lookAt(scene.position)

      // ── Animate point lights ──────────────────────────────────
      pointLight1.position.x = Math.sin(time * 0.5) * 6
      pointLight1.position.y = Math.cos(time * 0.4) * 4
      pointLight2.position.x = Math.cos(time * 0.4) * 7
      pointLight2.position.y = Math.sin(time * 0.5) * 3

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      starGeo.dispose(); starMat.dispose()
      netGeo.dispose(); netMat.dispose()
      netLineMat.dispose(); beamMat.dispose()
      orbData.forEach(o => {
        o.mesh.geometry.dispose()
        ;(o.mesh.material as THREE.Material).dispose()
      })
    }
  }, [theme])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-auto"
      style={{ background: 'transparent' }}
    />
  )
}
