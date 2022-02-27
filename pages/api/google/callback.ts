import { setCookies } from 'cookies-next'
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
  passport.authenticate('google', (err, user, info) => {
    if (err || !user) {
      return res.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/?a=auth_fail`
      )
    }

    // set cookie and send redirect
    setCookies('token', info.token, {
      req,
      res,
    })
    setCookies('userId', user._id, { req, res })
    res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/`)
  })(req, res, next)
}
