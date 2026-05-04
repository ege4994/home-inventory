interface IsometricBoxProps {
  color: string
  size?: number
  className?: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

function lighten(hex: string, f: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f)
}

function darken(hex: string, f: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - f), g * (1 - f), b * (1 - f))
}

// Isometric box: viewBox 0 0 100 90
// Top face:   (50,2)  → (92,23) → (50,44) → (8,23)
// Left face:  (8,23)  → (50,44) → (50,88) → (8,67)
// Right face: (50,44) → (92,23) → (92,67) → (50,88)
export function IsometricBox({ color, size = 48, className }: IsometricBoxProps) {
  const topColor = lighten(color, 0.48)
  const leftColor = color
  const rightColor = darken(color, 0.22)
  const strokeColor = darken(color, 0.38)

  const width = size
  const height = Math.round(size * 0.9)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 90"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Top face (lid) */}
      <polygon
        points="50,2 92,23 50,44 8,23"
        fill={topColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left face */}
      <polygon
        points="8,23 50,44 50,88 8,67"
        fill={leftColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right face */}
      <polygon
        points="50,44 92,23 92,67 50,88"
        fill={rightColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Center crease on lid */}
      <line
        x1="50" y1="2" x2="50" y2="44"
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.25"
      />
    </svg>
  )
}
