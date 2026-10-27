import { Component, StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const App = lazy(() => import('./App.jsx'))
function LoadingFallback({ failed = false }) {
  return <main className="boot-fallback">
    <h1>施凯峰 XIAOKAI</h1>
    <p>游戏开发 · 技术美术 · UE5 / Unity</p>
    <p>{failed ? '页面资源暂时无法加载，请刷新重试，或先查看以下作品。' : '正在加载作品集，网络较慢时可以先查看视频或简历。'}</p>
    <a href="https://space.bilibili.com/319496344" target="_blank" rel="noreferrer">Bilibili 作品视频 ↗</a>
    <a href={`${import.meta.env.BASE_URL}media/shi-kaifeng-resume.pdf`}>下载个人简历</a>
    {failed && <a href={window.location.href}>重新加载页面</a>}
    <small>联系邮箱 3126976394@qq.com</small>
  </main>
}
class PortfolioBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <LoadingFallback failed /> : this.props.children }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioBoundary><Suspense fallback={<LoadingFallback />}><App /></Suspense></PortfolioBoundary>
  </StrictMode>,
)
