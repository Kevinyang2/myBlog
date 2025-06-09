import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const usersFile = path.join(process.cwd(), 'data', 'users.json')

// 确保用户数据目录存在
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf8')
  }
}

// 获取所有用户
function getUsers() {
  ensureDataDirectory()
  const fileContents = fs.readFileSync(usersFile, 'utf8')
  return JSON.parse(fileContents)
}

// 保存用户数据
function saveUsers(users: any[]) {
  ensureDataDirectory()
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8')
}

// 检查邮箱是否已存在
function emailExists(email: string) {
  const users = getUsers()
  return users.some((user: any) => user.email === email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '姓名、邮箱和密码都是必填项' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6位' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已注册
    if (emailExists(email)) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建新用户
    const users = getUsers()
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    return NextResponse.json(
      { message: '注册成功！', user: { id: newUser.id, name, email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    )
  }
} 