import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

// 确保posts目录存在
function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// GET - 获取所有文章
export async function GET() {
  try {
    console.time('API-posts-GET') // 性能监控
    ensurePostsDirectory()
    
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .slice(0, 50) // 限制最多返回50篇文章，避免过度加载
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
          slug,
          title: matterResult.data.title || '无标题',
          date: matterResult.data.date || new Date().toISOString().split('T')[0],
          excerpt: matterResult.data.excerpt || matterResult.content.substring(0, 150) + '...',
          author: matterResult.data.author,
          tags: matterResult.data.tags,
          readTime: matterResult.data.readTime,
        }
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    console.timeEnd('API-posts-GET')
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // 缓存1分钟
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 })
  }
}

// POST - 创建新文章
export async function POST(request: NextRequest) {
  try {
    ensurePostsDirectory()
    
    const body = await request.json()
    const { title, content, excerpt, tags, author, readTime, date } = body

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    // 生成文件名（基于标题）
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) || 'untitled'

    // 如果文件已存在，添加数字后缀
    let finalSlug = slug
    let counter = 1
    while (fs.existsSync(path.join(postsDirectory, `${finalSlug}.md`))) {
      finalSlug = `${slug}-${counter}`
      counter++
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

    // 写入文件
    const filePath = path.join(postsDirectory, `${finalSlug}.md`)
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return NextResponse.json({ 
      message: '文章创建成功', 
      slug: finalSlug 
    })
  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 })
  }
} 