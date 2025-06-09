'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  author?: string
  tags?: string[]
  readTime?: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取文章列表失败:', error)
    }
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleEditPost = (slug: string) => {
    setEditingPost(slug)
    setShowEditor(true)
  }

  const handleDeletePost = async (slug: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      try {
        await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
        fetchPosts()
      } catch (error) {
        console.error('删除文章失败:', error)
      }
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingPost(null)
    fetchPosts()
  }

  if (showEditor) {
    return (
      <PostEditor 
        slug={editingPost}
        onClose={handleEditorClose}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">博客管理</h1>
        <button
          onClick={handleNewPost}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建文章
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标签
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {post.excerpt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleEditPost(post.slug)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有文章</h3>
            <p className="text-gray-500 mb-4">点击"新建文章"开始写作吧！</p>
            <button
              onClick={handleNewPost}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建文章
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 文章编辑器组件
function PostEditor({ slug, onClose }: { slug: string | null, onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [author, setAuthor] = useState('博主')
  const [readTime, setReadTime] = useState('5')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPost(slug)
    }
  }, [slug])

  const fetchPost = async (postSlug: string) => {
    try {
      const response = await fetch(`/api/posts/${postSlug}`)
      const post = await response.json()
      setTitle(post.title)
      setContent(post.content)
      setExcerpt(post.excerpt)
      setTags(post.tags?.join(', ') || '')
      setAuthor(post.author || '博主')
      setReadTime(post.readTime || '5')
    } catch (error) {
      console.error('获取文章失败:', error)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }

    setSaving(true)
    try {
      const postData = {
        title: title.trim(),
        content: content,
        excerpt: excerpt.trim() || content.substring(0, 150) + '...',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        author: author.trim(),
        readTime: readTime.trim(),
        date: new Date().toISOString().split('T')[0]
      }

      const url = slug ? `/api/posts/${slug}` : '/api/posts'
      const method = slug ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        onClose()
      } else {
        alert('保存失败，请重试')
      }
    } catch (error) {
      console.error('保存文章失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {slug ? '编辑文章' : '新建文章'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 文章基本信息 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入文章标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作者
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="技术, 生活, 感悟"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                阅读时间 (分钟)
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章摘要
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="简短描述文章内容 (可选，留空将自动生成)"
            />
          </div>
        </div>

        {/* Markdown 编辑器 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">文章内容</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"
              rows={20}
              placeholder="在这里使用 Markdown 语法写作..."
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            支持 Markdown 语法：**粗体**、*斜体*、`代码`、[链接](URL)、图片等
          </div>
        </div>

        {/* Markdown 语法提示 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">Markdown 语法提示</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div># 一级标题</div>
            <div>## 二级标题</div>
            <div>**粗体** *斜体*</div>
            <div>[链接文字](URL)</div>
            <div>`行内代码`</div>
            <div>```语言<br/>代码块<br/>```</div>
            <div>&gt; 引用文字</div>
          </div>
        </div>
      </div>
    </div>
  )
} 