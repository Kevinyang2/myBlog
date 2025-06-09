'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default function AuthNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">登出</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signin"
        className="text-gray-700 hover:text-blue-600 transition-colors"
      >
        登录
      </Link>
      <Link
        href="/auth/signup"
        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        注册
      </Link>
    </div>
  )
} 