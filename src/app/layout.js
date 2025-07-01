import { Inter } from 'next/font/google'
import '@/app/global.css'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={interFont.className}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Trend Notifier',
}

export default RootLayout