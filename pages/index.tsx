import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import connect from '../lib/database'
import { FC } from 'react'
import { sortByDate, checkAuth } from '../utils'
import mongoose from 'mongoose'

interface Props {
  courses: [
    {
      name: string
      price: number
      date: string
      image: string
      author_name: string
      author_image: string
      description: string
      slug: string
    }
  ]
  auth: {
    auth: boolean
    user: {
      name: string
      email: string
      courses: [string]
    }
  }
}

const Home = ({ courses, auth }: Props) => {
  return (
    <div className="">
      <Head>
        <title>Readlilearn Sample Learning Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar loggedIn={auth?.auth} />
      <Hero />
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 flex-col items-center justify-between gap-5 p-4 py-16 text-white xl:p-0 xl:py-16">
        {courses.map((course) => (
          <CourseCard
            authorImage={course.author_image}
            authorName={course.author_name}
            date={course.date}
            description={course.description}
            image={course.image}
            name={course.name}
            slug={course.slug}
            price={course.price}
            key={course.slug}
          />
        ))}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    await connect()
    const auth = await checkAuth(ctx.req, ctx.res)
    const courses = fs.readdirSync(path.join('courses'))
    console.log(courses)

    const coursesData = courses.map((slug) => {
      const fileContent = fs.readFileSync(
        path.join(__dirname, '..', 'courses', slug, 'index.md'),
        'utf-8'
      )
      const { data, content } = matter(fileContent)
      return { slug, ...data }
    })

    console.log(coursesData)

    return {
      props: {
        auth,
        courses: coursesData.sort(sortByDate),
      },
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        authed: false,
        ownedCourses: null,
        user: null,
      },
    }
  }
}
