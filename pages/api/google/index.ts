import { NextApiRequest, NextApiResponse } from 'next'
import passport from 'passport'
import connect from '../../../lib/database'
import '../../../lib/passport'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  await connect()
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next)
}
