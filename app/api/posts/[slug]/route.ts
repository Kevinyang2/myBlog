import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

// GET - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const filePath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const matterResult = matter(fileContents)

    const post = {
      slug,
      title: matterResult.data.title || '无标题',
      date: matterResult.data.date || new Date().toISOString().split('T')[0],
      excerpt: matterResult.data.excerpt || matterResult.content.substring(0, 150) + '...',
      content: matterResult.content,
      author: matterResult.data.author,
      tags: matterResult.data.tags,
      readTime: matterResult.data.readTime,
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 })
  }
}

// PUT - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { title, content, excerpt, tags, author, readTime, date } = body

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    const filePath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    // 创建front matter
    const frontMatter = {
      title,
      date: date || new Date().toISOString().split('T')[0],
      excerpt: excerpt || content.substring(0, 150) + '...',
      author: author || '博主',
      tags: tags || [],
      readTime: readTime || '5',
    }

    // 生成markdown文件内容
    const fileContent = matter.stringify(content, frontMatter)

    // 更新文件
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ message: '文章更新成功' })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 })
  }
}

// DELETE - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const filePath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ message: '文章删除成功' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 })
  }
} 