import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React, { useState } from 'react'
import Navbar from '../../../components/Navbar'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import styles from '../../../styles/markdown.module.css'
import Head from 'next/head'
import { useStripe } from '@stripe/react-stripe-js'
import { getCookie, getCookies } from 'cookies-next'
import connect from '../../../lib/database'
import { checkAuth } from '../../../utils'
import { Auth } from '../../../utils/globaltypes'
import { useRouter } from 'next/router'

interface Props {
  data: {
    name: string
    price: number
    date: string
    image: string
    author_name: string
    author_image: string
    description: string
  }
  slug: string
  content: string
  auth: Auth
}

export default function CourseHome({ slug, data, content, auth }: Props) {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const stripe = useStripe()

  const purchaseCourse = async () => {
    try {
      if (loading) return
      setLoading(true)
      const response: any = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course: slug, userId: getCookie('userId') }),
      })
      const jsondata = await response.json()

      await stripe?.redirectToCheckout({
        sessionId: jsondata.paymentId,
      })
    } catch (err) {
      console.error(err)
      alert('Something went wrong, please try again later.')
    }
  }

  return (
    <div>
      <Head>
        <title>{data.name}</title>
      </Head>
      <Navbar loggedIn={auth.auth} />
      <div className="relative mx-auto mt-16 flex w-full max-w-7xl flex-col-reverse justify-between p-4 text-white lg:flex-row xl:p-0">
        <div className="">
          <h1 className="text-5xl font-bold">{data.name}</h1>
          <ReactMarkdown className={styles.markdown} children={content} />
        </div>
        <div className="mb-10 h-56 w-80 rounded-lg border-[1px] border-gray-600 bg-slate-900 p-7 text-xl lg:mb-0 lg:ml-5">
          <div className="">Purchase this course</div>
          <div className="mt-5 text-5xl font-bold">
            <span
              className={
                auth?.user?.courses?.includes(slug) ? 'line-through' : ''
              }
            >
              {data.price}
            </span>{' '}
            <span className="text-xl">USD</span>
          </div>
          <button
            onClick={
              auth.auth
                ? auth?.user?.courses?.includes(slug)
                  ? () => {
                      router.push(`/course/${slug}/1`)
                    }
                  : purchaseCourse
                : () => (window.location.href = '/api/google')
            }
            className="mt-5 w-full rounded-md bg-blue-800 py-3"
          >
            {auth.auth
              ? loading
                ? 'Loading'
                : auth?.user?.courses?.includes(slug)
                ? 'Learn'
                : 'Purchase'
              : 'Login to Purchase'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    await connect()
    const auth = await checkAuth(ctx.req, ctx.res)
    console.log(ctx.params)
    const fileContent = fs.readFileSync(
      path.join('courses', ctx.params!.slug as string, 'index.md'),
      'utf-8'
    )

    const { data, content } = matter(fileContent)
    console.log(data)

    return {
      props: {
        auth,
        slug: ctx.params!.slug as string,
        data,
        content,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      redirect: { destination: '/' },
      props: {},
    }
  }
}
