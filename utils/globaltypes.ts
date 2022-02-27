export interface Auth {
  auth: boolean
  user?: {
    name: string
    email: string
    courses: [string]
  }
}

export interface Lessons {
  title: string
  lessonNumber: number
}
