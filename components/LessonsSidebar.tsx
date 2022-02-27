import Link from 'next/link'
import React from 'react'

interface Props {
  lessons: [
    {
      title: string
      lessonNumber: string
    }
  ]
  courseId: string
}

export default function LessonsSidebar({ lessons, courseId }: Props) {
  console.log(lessons)
  return (
    <div className="mb-16 flex w-full flex-col self-start rounded-md bg-slate-900 p-7 text-lg lg:mb-0 lg:w-72">
      {lessons.map((lesson, index) => (
        <a href={`/course/${courseId}/${lesson.lessonNumber}`} className="my-1">
          {lesson.title}
        </a>
      ))}
    </div>
  )
}
