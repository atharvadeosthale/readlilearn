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
}

export default function CourseHome({ slug, data, content }: Props) {
  const [loading, setLoading] = useState<boolean>(false)

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
      <Navbar />
      <div className="relative mx-auto mt-16 flex w-full max-w-7xl justify-between p-4 text-white xl:p-0">
        <div className="">
          <h1 className="text-5xl font-bold">{data.name}</h1>
          <ReactMarkdown className={styles.markdown} children={content} />
        </div>
        <div className="ml-5 h-56 w-80 rounded-lg border-[1px] border-gray-600 bg-slate-900 p-7 text-xl">
          <div className="">Purchase this course</div>
          <div className="mt-5 text-5xl font-bold">
            {data.price} <span className="text-xl">USD</span>
          </div>
          <button
            onClick={purchaseCourse}
            className="mt-5 w-full rounded-md bg-blue-800 py-3"
          >
            {loading ? 'Loading' : 'Purchase'}
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
    console.log(ctx.params)
    const fileContent = fs.readFileSync(
      path.join('courses', ctx.params!.slug as string, 'index.md'),
      'utf-8'
    )

    const { data, content } = matter(fileContent)
    console.log(data)

    return {
      props: {
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
