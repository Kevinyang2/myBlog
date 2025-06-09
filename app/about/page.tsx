import React from 'react'
import { User, Mail, Github, Twitter } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 头部区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">关于我</h1>
              <p className="text-xl opacity-90">欢迎了解我的故事</p>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-8">
          <div className="prose max-w-none">
            <h2>你好，我是博主！</h2>
            
            <p>
              欢迎来到我的个人博客！我是一名热爱技术和生活的开发者，
              喜欢在这里记录我的学习心得、技术分享和生活感悟。
            </p>

            <h3>我的兴趣</h3>
            <ul>
              <li>💻 前端开发与用户体验设计</li>
              <li>🚀 新技术学习与实践</li>
              <li>📚 阅读与知识分享</li>
              <li>🎵 音乐与艺术欣赏</li>
              <li>🌍 旅行与摄影</li>
            </ul>

            <h3>技术栈</h3>
            <p>
              我主要专注于现代 Web 开发技术：
            </p>
            <ul>
              <li><strong>前端：</strong>React, Next.js, TypeScript, Tailwind CSS</li>
              <li><strong>后端：</strong>Node.js, Python, PostgreSQL</li>
              <li><strong>工具：</strong>Git, Docker, VS Code</li>
              <li><strong>云服务：</strong>Vercel, AWS, Cloudflare</li>
            </ul>

            <h3>为什么写博客？</h3>
            <p>
              我相信分享是最好的学习方式。通过写博客，我不仅能整理自己的思路，
              还能帮助其他人解决问题。同时，我也希望通过这个平台结识更多志同道合的朋友。
            </p>

            <blockquote>
              "教是最好的学，分享是最快的成长。"
            </blockquote>
          </div>

          {/* 联系方式 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">联系我</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:your-email@example.com" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                邮箱
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a 
                href="https://twitter.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 