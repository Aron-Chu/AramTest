// pages/_app.tsx
import type { AppProps } from 'next/app'
// Import the global CSS file for a dark background and minimal styling
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  // We simply return the page component.
  // If you want a global Layout, you can wrap <Component> here.
  return <Component {...pageProps} />
}

export default MyApp
