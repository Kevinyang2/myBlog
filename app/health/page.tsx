'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

interface HealthCheck {
  name: string
  status: 'checking' | 'success' | 'error'
  message: string
  responseTime?: number
}

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: 'API - 文章列表', status: 'checking', message: '检查中...' },
    { name: 'API - 认证状态', status: 'checking', message: '检查中...' },
    { name: '文件系统', status: 'checking', message: '检查中...' },
    { name: '静态资源', status: 'checking', message: '检查中...' },
  ])

  const runHealthChecks = async () => {
    // 重置状态
    setChecks(prev => prev.map(check => ({ ...check, status: 'checking', message: '检查中...' })))

    // 检查文章API
    try {
      const start = Date.now()
      const response = await fetch('/api/posts', {
        headers: { 'Cache-Control': 'no-cache' }
      })
      const responseTime = Date.now() - start
      
      setChecks(prev => prev.map(check => 
        check.name === 'API - 文章列表' 
          ? { 
              ...check, 
              status: response.ok ? 'success' : 'error',
              message: response.ok ? `响应正常 (${responseTime}ms)` : `HTTP ${response.status}`,
              responseTime 
            }
          : check
      ))
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === 'API - 文章列表' 
          ? { ...check, status: 'error', message: `连接失败: ${error.message}` }
          : check
      ))
    }

    // 检查认证API
    try {
      const start = Date.now()
      const response = await fetch('/api/auth/session')
      const responseTime = Date.now() - start
      
      setChecks(prev => prev.map(check => 
        check.name === 'API - 认证状态' 
          ? { 
              ...check, 
              status: response.ok ? 'success' : 'error',
              message: response.ok ? `响应正常 (${responseTime}ms)` : `HTTP ${response.status}`,
              responseTime 
            }
          : check
      ))
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === 'API - 认证状态' 
          ? { ...check, status: 'error', message: `连接失败: ${error.message}` }
          : check
      ))
    }

    // 检查文件系统（通过创建测试文章）
    try {
      const testData = {
        title: 'Health Check Test',
        content: '# 测试文章\n这是健康检查测试文章',
        author: 'System',
        tags: ['test']
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (response.ok) {
        const result = await response.json()
        // 立即删除测试文章
        if (result.slug) {
          await fetch(`/api/posts/${result.slug}`, { method: 'DELETE' })
        }
        
        setChecks(prev => prev.map(check => 
          check.name === '文件系统' 
            ? { ...check, status: 'success', message: '读写正常' }
            : check
        ))
      } else {
        setChecks(prev => prev.map(check => 
          check.name === '文件系统' 
            ? { ...check, status: 'error', message: '写入失败' }
            : check
        ))
      }
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === '文件系统' 
          ? { ...check, status: 'error', message: `文件系统错误: ${error.message}` }
          : check
      ))
    }

    // 检查静态资源
    try {
      const start = Date.now()
      const response = await fetch('/favicon.ico')
      const responseTime = Date.now() - start
      
      setChecks(prev => prev.map(check => 
        check.name === '静态资源' 
          ? { 
              ...check, 
              status: response.ok ? 'success' : 'error',
              message: response.ok ? `加载正常 (${responseTime}ms)` : '静态资源加载失败',
              responseTime 
            }
          : check
      ))
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === '静态资源' 
          ? { ...check, status: 'error', message: `静态资源错误: ${error.message}` }
          : check
      ))
    }
  }

  useEffect(() => {
    runHealthChecks()
  }, [])

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return 'bg-blue-50 border-blue-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
    }
  }

  const overallStatus = checks.every(check => check.status === 'success') 
    ? 'success' 
    : checks.some(check => check.status === 'error') 
    ? 'error' 
    : 'checking'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">系统健康检查</h1>
        <p className="text-gray-600">检查站点各个组件的运行状态</p>
      </div>

      {/* 总体状态 */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${getStatusColor(overallStatus)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(overallStatus)}
          <div>
            <h2 className="text-xl font-semibold">
              总体状态: {overallStatus === 'success' ? '正常' : overallStatus === 'error' ? '异常' : '检查中'}
            </h2>
            <p className="text-gray-600">
              {overallStatus === 'success' 
                ? '所有系统组件运行正常' 
                : overallStatus === 'error' 
                ? '发现系统问题，请查看详情' 
                : '正在检查系统组件...'}
            </p>
          </div>
        </div>
      </div>

      {/* 详细检查结果 */}
      <div className="space-y-4">
        {checks.map((check, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <h3 className="font-semibold">{check.name}</h3>
                  <p className="text-sm text-gray-600">{check.message}</p>
                </div>
              </div>
              {check.responseTime && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {check.responseTime}ms
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 重新检查按钮 */}
      <div className="mt-8 text-center">
        <button
          onClick={runHealthChecks}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          重新检查
        </button>
      </div>

      {/* 故障排除建议 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">故障排除建议</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• 如果API响应时间超过5000ms，可能是服务器性能问题</li>
          <li>• 如果文件系统检查失败，检查磁盘空间和权限</li>
          <li>• 如果静态资源加载失败，检查CDN或服务器配置</li>
          <li>• 持续的连接失败可能是网络或DNS问题</li>
        </ul>
      </div>
    </div>
  )
} 