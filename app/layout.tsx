import React from 'react'
import { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import AuthNav from './components/AuthNav'

export const metadata: Metadata = {
  title: '我的个人博客',
  description: '记录生活，分享技术，探索世界',
  keywords: ['博客', '技术', '生活', '分享'],
  authors: [{ name: '博主' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  我的个人博客
                </a>
                <p className="text-gray-600 mt-1">记录生活，分享技术</p>
              </div>
              <div className="flex items-center space-x-8">
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">首页</a>
                  <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">关于我</a>
                  <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">写文章</a>
                  <a href="/health" className="text-gray-700 hover:text-blue-600 transition-colors">系统状态</a>
                </nav>
                <AuthNav />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 我的个人博客. 保留所有权利.</p>
              <p className="mt-2">用 ❤️ 和 Next.js 构建</p>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  )
} 