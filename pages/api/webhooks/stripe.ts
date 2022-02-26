import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import connect from '../../../lib/database'
import User from '../../../models/User'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect()
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: any

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err}`)
      res.status(400).send(`Webhook Error`)
      return
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id)
    if (event.type == 'checkout.session.completed') {
      // payment succeeded
      console.log(
        'Payment complete, user id - ' +
          event.data.object.metadata.userId +
          ' course - ' +
          event.data.object.metadata.course
      )
      // fulfil payment
      console.log(event.data.object)
      const obj = await User.findOneAndUpdate(
        { _id: event.data.object.metadata.userId },
        { $push: { courses: { id: event.data.object.metadata.course } } }
      )
      console.log(obj)
    }
    // ...
    return res.json({ ok: true })
  }
}
