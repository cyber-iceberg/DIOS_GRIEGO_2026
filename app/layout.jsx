import './globals.css'

export const metadata = {
  title: 'FORGE — Protocolo de entrenamiento',
  description: 'Forjado para no fallar ni una semana',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#07090d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
