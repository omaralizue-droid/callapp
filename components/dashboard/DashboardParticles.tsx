'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function DashboardParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100)
    camera.position.set(0, 0, 10)

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Ambient Particles ──────────────────────────────────────
    const count = 90
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#4f46e5'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#06b6d4'),
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel[i * 3]     = (Math.random() - 0.5) * 0.012
      vel[i * 3 + 1] = -(Math.random() * 0.006 + 0.003)  // drift upward
      vel[i * 3 + 2] = 0
      const c = palette[Math.floor(Math.random() * palette.length)]
      cols[i * 3]     = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

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
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
      const posArr = posAttr.array as Float32Array

      for (let i = 0; i < count; i++) {
        posArr[i * 3]     += vel[i * 3]
        posArr[i * 3 + 1] += vel[i * 3 + 1]
        posArr[i * 3 + 2] += vel[i * 3 + 2]

        // Gentle horizontal wave
        posArr[i * 3] += Math.sin(time * 0.3 + i * 0.4) * 0.002

        // Wrap vertically
        if (posArr[i * 3 + 1] < -12) posArr[i * 3 + 1] = 12
        if (posArr[i * 3]     >  9)  posArr[i * 3]     = -9
        if (posArr[i * 3]     < -9)  posArr[i * 3]     = 9
      }

      posAttr.needsUpdate = true

      // Gentle drift rotation
      particles.rotation.z = Math.sin(time * 0.05) * 0.03

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geo.dispose()
      mat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
