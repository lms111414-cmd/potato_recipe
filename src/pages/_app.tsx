import type { AppProps } from 'next/app'
import '@/globals.css'
import { RecipeProvider } from '@/context/RecipeContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecipeProvider>
      <div className="min-h-screen bg-beige-light">
        <Component {...pageProps} />
      </div>
    </RecipeProvider>
  )
}
