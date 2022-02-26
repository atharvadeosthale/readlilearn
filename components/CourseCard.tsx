import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'

interface Props {
  date: string
  name: string
  description: string
  slug: string
  image: string
  authorName: string
  authorImage: string
  price: string | number
}

export default function CourseCard({
  date,
  name,
  description,
  slug,
  image,
  authorImage,
  authorName,
  price,
}: Props) {
  const router: NextRouter = useRouter()

  const redirectToBlog = (): void => {
    router.push(`/posts/${slug}`)
  }

  return (
    <div
      className="flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-[1px] border-[#4e4e4e] md:h-72 md:flex-row"
      onClick={redirectToBlog}
    >
      <img
        alt={name}
        src={image}
        className="h-80 w-full object-cover md:h-full md:w-96"
      />
      <div className="flex flex-col justify-center p-5">
        <div className="font-bold uppercase text-slate-400">{date}</div>
        <div className="mt-2 text-2xl font-bold">
          {name} ({price} USD)
        </div>
        <div className="line-clamp-3 md:line-clamp-2 mt-2 text-xl leading-normal">
          {description}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              alt={authorName}
              src={authorImage}
              height={40}
              width={40}
              className="rounded-full object-cover"
            />
            <span className="ml-3 text-gray-300">{authorName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
