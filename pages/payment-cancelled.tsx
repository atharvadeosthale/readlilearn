import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  slug: string
}

export default function PaymentSuccess({ slug }: Props) {
  const router = useRouter()

  const goToCourse = () => {
    router.push(`/course/${slug}`)
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-white">
      <Head>
        <title>Payment failed</title>
      </Head>
      <img
        src="https://www.downloadclipart.net/thumb/52728-wrong-cross-icon.png"
        className="w-4- mb-10 h-40"
      />
      <h1 className="text-4xl font-bold">Payment failed</h1>
      <button
        onClick={goToCourse}
        className="mt-10 rounded-lg bg-blue-600 px-5 py-3 text-lg"
      >
        Try again
      </button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  return {
    props: {
      slug: ctx.query.course as string,
    },
  }
}
