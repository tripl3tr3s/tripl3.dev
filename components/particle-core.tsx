"use client"

import ParticleObject from "@/components/canvasui/ParticleObject"

interface ParticleCoreProps {
  readonly count: number
  readonly maxDpr: number
  readonly onLoad: () => void
  readonly onError: () => void
}

export default function ParticleCore({ count, maxDpr, onLoad, onError }: ParticleCoreProps) {
  return (
    <ParticleObject
      src="/dado_333_amarillo_sin fondo.webp"
      count={count}
      maxDpr={maxDpr}
      size={1.5}
      sizeVariance={1}
      scale={2}
      radius={60}
      strength={1.5}
      swirl={0.4}
      spring={0.5}
      damping={0.5}
      drift={3}
      floatIntensity={0}
      rotationIntensity={0.2}
      floatSpeed={1}
      orbit={true}
      zoom={true}
      yOffset={-0.2}
      autoRotate={true}
      autoRotateSpeed={2}
      onLoad={onLoad}
      onError={onError}
      className="h-full w-full"
    />
  )
}
