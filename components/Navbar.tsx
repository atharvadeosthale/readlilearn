import { removeCookies } from 'cookies-next'
import Image from 'next/image'
import React from 'react'

interface Props {
  loggedIn: boolean
}

export default function Navbar({ loggedIn }: Props) {
  const logout = () => {
    removeCookies('userId')
    removeCookies('token')
    window.location.reload()
  }
  return (
    <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between p-4 text-white xl:p-0">
      <div className="absolute top-0 left-0 -z-10 h-48 w-full  bg-[#2A468E] blur-[140px]"></div>
      <div className="flex items-center">
        <img
          src="https://pngimg.com/uploads/book/book_PNG2105.png"
          height={50}
          width={50}
          className="rounded-full object-cover"
          alt="Atharva's Blog"
        />
        <span className="ml-5 text-lg font-medium">Readlilearn</span>
      </div>
      <div className="flex items-center">
        {loggedIn ? (
          <a onClick={logout}>Logout</a>
        ) : (
          <a href="/api/google">Login</a>
        )}
      </div>
    </div>
  )
}
