import React, { FormEvent, useState } from 'react'

export default function Hero() {
  const [email, setEmail] = useState<string>('')

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-7 py-16 text-center text-white xl:p-0 xl:py-16">
      <div className="max-w-5xl text-4xl font-black leading-snug lg:text-7xl lg:leading-[5rem]">
        Learn programming through quality courses!
      </div>
      <div className="mt-10 max-w-2xl text-xl leading-normal text-gray-400 md:text-2xl">
        Explore my courses and learn new skills quickly. Ditch video courses,
        adopt written courses!
      </div>
    </div>
  )
}
