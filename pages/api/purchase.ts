import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import connect from '../../lib/database'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

export default async function purchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res
      .status(405)
      .json({ message: 'This route only supports POST requests' })

  try {
    await connect()
    console.log(req.body)
    const { course, userId } = req.body
    if (!userId || !course) {
      return res
        .status(400)
        .json({ message: 'An error occured, try re-logging in' })
    }
    const fileContent = fs.readFileSync(
      path.join('courses', course, 'index.md'),
      'utf-8'
    )
    const { data } = matter(fileContent)
    if (!data) return res.status(404).json({ message: 'Invalid course' })
    const { price, name } = data
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success?course=${course}`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancelled?course=${course}`,
        line_items: [
          {
            name,
            amount: price * 100,
            currency: 'inr',
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        metadata: {
          userId,
          course,
        },
      })

    res.status(200).json({
      paymentId: checkoutSession.id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
