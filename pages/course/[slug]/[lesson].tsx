import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import connect from '../../../lib/database'
import { checkAuth } from '../../../utils'
import { Auth, Lessons } from '../../../utils/globaltypes'
import Navbar from '../../../components/Navbar'
import Head from 'next/head'
import User from '../../../models/User'
import { getCookie } from 'cookies-next'
import mongoose from 'mongoose'
import LessonsSidebar from '../../../components/LessonsSidebar'
import ReactMarkdown from 'react-markdown'
import styles from '../../../styles/markdown.module.css'
import Script from 'next/script'

interface Props {
  auth: Auth
  lessons: [
    {
      title: string
      lessonNumber: string
    }
  ]
  lessonData: {
    data: {
      title: string
    }
    content: string
  }
  currentLesson: string
  courseId: string
}

export default function Lesson({
  auth,
  currentLesson,
  lessonData,
  lessons,
  courseId,
}: Props) {
  return (
    <div>
      <Head>
        <title>Lesson - Readlilearn</title>
      </Head>

      <Navbar loggedIn={auth.auth} />

      <div className="relative mx-auto mt-16 flex w-full max-w-7xl flex-col-reverse justify-between p-4 text-white lg:flex-row  xl:p-0">
        <div className="">
          <div className="text-4xl font-bold">{lessonData.data.title}</div>
          <ReactMarkdown
            children={lessonData.content}
            className={styles.markdown}
          />
        </div>
        <LessonsSidebar lessons={lessons} courseId={courseId} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    // check if logged in
    await connect()
    const auth: Auth = await checkAuth(ctx.req, ctx.res)
    if (!auth.auth) {
      return {
        props: {},
        redirect: {
          destination: '/',
        },
      }
    }

    // check if enrolled in course
    if (!auth.user?.courses.includes(ctx.params!.slug as string)) {
      return {
        props: {},
        redirect: {
          destination: `/course/${ctx.params!.slug}`,
        },
      }
    }

    // get lesson
    const lessonFile = fs.readFileSync(
      path.join(
        'courses',
        ctx.params!.slug as string,
        (ctx.params!.lesson as string) + '.md'
      ),
      'utf-8'
    )
    const { data, content } = matter(lessonFile)

    // get all lessons in course to display
    const lessons = fs.readdirSync(
      path.join('courses', ctx.params!.slug as string)
    )

    const lessonsData: any = lessons.map((lesson, index) => {
      if (lesson == 'index.md') return false
      const lessonFile = fs.readFileSync(
        path.join('courses', ctx.params!.slug as string, lesson),
        'utf-8'
      )
      const { data, content } = matter(lessonFile)
      return {
        title: data.title,
        lessonNumber: lesson.replace('.md', ''),
      }
    })

    console.log(lessonsData)

    return {
      props: {
        auth,
        lessons: lessonsData.sort(
          (a: any, b: any) =>
            parseInt(a.lessonNumber) - parseInt(b.lessonNumber)
        ),
        lessonData: { data, content },
        courseId: ctx.params!.slug as string,
        currentLesson: ctx.params!.lesson as string,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      redirect: { destination: '/' },
      props: {},
    }
  }
}
