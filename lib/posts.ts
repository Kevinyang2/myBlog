import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author?: string
  tags?: string[]
  readTime?: string
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    console.time('getAllPosts') // 性能监控
    
    // 如果 posts 目录不存在，返回空数组
    if (!fs.existsSync(postsDirectory)) {
      console.log('Posts directory does not exist')
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    console.log(`Found ${fileNames.length} files in posts directory`)
    
    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .slice(0, 50) // 限制文章数量
        .map(async (fileName) => {
          try {
            const slug = fileName.replace(/\.md$/, '')
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const matterResult = matter(fileContents)

            return {
              slug,
              title: matterResult.data.title || '无标题',
              date: matterResult.data.date || new Date().toISOString().split('T')[0],
              excerpt: matterResult.data.excerpt || matterResult.content.substring(0, 150) + '...',
              content: matterResult.content,
              author: matterResult.data.author,
              tags: matterResult.data.tags,
              readTime: matterResult.data.readTime,
            }
          } catch (fileError) {
            console.error(`Error processing file ${fileName}:`, fileError)
            return null
          }
        })
    )

    // 过滤掉处理失败的文章
    const validPosts = allPostsData.filter(post => post !== null) as Post[]
    
    // 按日期排序
    const sortedPosts = validPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
    
    console.timeEnd('getAllPosts')
    console.log(`Successfully loaded ${sortedPosts.length} posts`)
    
    return sortedPosts
  } catch (error) {
    console.error('获取文章列表时出错:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    // 将 markdown 转换为 HTML
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: matterResult.data.title || '无标题',
      date: matterResult.data.date || new Date().toISOString().split('T')[0],
      excerpt: matterResult.data.excerpt || matterResult.content.substring(0, 150) + '...',
      content: contentHtml,
      author: matterResult.data.author,
      tags: matterResult.data.tags,
      readTime: matterResult.data.readTime,
    }
  } catch (error) {
    return null
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
} 