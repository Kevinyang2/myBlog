# 个人博客系统

这是一个使用 Next.js 14 构建的现代化个人博客系统，具有优雅的界面设计和出色的用户体验。

## ✨ 特性

- 🚀 **现代技术栈**：基于 Next.js 14、React 18、TypeScript
- 🎨 **美观设计**：使用 Tailwind CSS 构建响应式设计
- 📝 **Markdown 支持**：使用 Markdown 格式写作，支持代码高亮
- 📱 **移动友好**：完全响应式设计，适配各种设备
- ⚡ **高性能**：静态生成，快速加载
- 🔍 **SEO 优化**：完整的 meta 标签和结构化数据
- 🎯 **易于部署**：支持 Vercel、Netlify 等平台一键部署

## 🛠 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: Markdown + Gray Matter
- **图标**: Lucide React
- **部署**: Vercel / Netlify

## 📦 安装和使用

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd personal-blog
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 4. 写作博客文章

在 `posts` 目录下创建 `.md` 文件，文件开头需要包含 Front Matter：

```markdown
---
title: "文章标题"
date: "2024-01-15"
excerpt: "文章摘要"
author: "作者名"
tags: ["标签1", "标签2"]
readTime: "5"
---

# 文章内容

这里是你的文章内容...
```

## 📁 项目结构

```
personal-blog/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── about/             # 关于页面
│   └── posts/[slug]/      # 文章详情页面
├── lib/                   # 工具库
│   └── posts.ts          # 文章处理逻辑
├── posts/                 # Markdown 文章
│   ├── hello-world.md
│   └── react-best-practices.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 自定义配置

### 修改网站信息

编辑 `app/layout.tsx` 文件中的 metadata：

```tsx
export const metadata: Metadata = {
  title: '你的博客名称',
  description: '你的博客描述',
  // ...
}
```

### 修改个人信息

编辑 `app/about/page.tsx` 文件，更新个人信息和联系方式。

### 自定义样式

- 全局样式：编辑 `app/globals.css`
- Tailwind 配置：编辑 `tailwind.config.js`

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### Netlify 部署

1. 将代码推送到 GitHub
2. 在 [Netlify](https://netlify.com) 导入项目
3. 构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`out` (需要配置静态导出)

### 手动部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

## 📝 写作指南

### Front Matter 字段说明

- `title`: 文章标题（必填）
- `date`: 发布日期，格式 YYYY-MM-DD（必填）
- `excerpt`: 文章摘要，显示在列表页
- `author`: 作者名称
- `tags`: 标签数组
- `readTime`: 预估阅读时间（分钟）

### Markdown 语法支持

支持所有标准 Markdown 语法：

- 标题（H1-H6）
- 段落和换行
- **粗体** 和 *斜体*
- 列表（有序和无序）
- 链接和图片
- 代码块和行内代码
- 引用块
- 表格

### 代码高亮

支持多种编程语言的代码高亮：

```javascript
function hello() {
  console.log('Hello, World!')
}
```

```python
def hello():
    print("Hello, World!")
```

## 🔧 开发

### 添加新功能

1. 创建新的组件在适当的目录
2. 更新路由（如果需要）
3. 添加样式
4. 测试功能

### 常用命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🎉 开始写作

现在你可以开始在 `posts` 目录下创建你的第一篇博客文章了！记住：

1. 文件名将成为文章的 URL slug
2. 使用有意义的文件名，如 `my-first-post.md`
3. 不要忘记在文件开头添加 Front Matter
4. 享受写作的乐趣！

祝你写作愉快！ 🎊 