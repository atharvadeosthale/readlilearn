import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React from 'react'

export default function CourseRedirect() {
  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  return { redirect: { destination: '/' }, props: {} }
}
