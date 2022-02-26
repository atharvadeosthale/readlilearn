import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  accessToken: String,
  tokens: [String],
  courses: [
    {
      id: String,
    },
  ],
})

let User: mongoose.Model<mongoose.Document>

try {
  User = mongoose.model('users')
} catch (err) {
  User = mongoose.model('users', UserSchema)
}

export default User
