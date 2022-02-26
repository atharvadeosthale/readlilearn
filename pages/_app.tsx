import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Elements stripe={stripe}>
      <Component {...pageProps} />
    </Elements>
  )
}

export default MyApp
