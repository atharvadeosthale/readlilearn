import { getCookie, removeCookies } from 'cookies-next'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date)
}

export const checkAuth = async (req, res) => {
  try {
    const token = getCookie('token', { req, res })
    if (!token) {
      removeCookies('userId', { req, res })
      return { auth: false }
    }
    const verify = await jwt.verify(token, process.env.JWT_SECRET)
    const obj = await User.findOne({ _id: verify.id })
    if (!obj) {
      removeCookies('userId', { req, res })
      return { auth: false }
    }
    const ownedCourses = obj.courses.map((course) => course.id)
    return {
      auth: true,
      user: { name: obj.name, email: obj.email, courses: ownedCourses },
    }
  } catch (err) {
    removeCookies('token', { req, res })
    removeCookies('userId', { req, res })
    return {
      auth: false,
    }
  }
}
