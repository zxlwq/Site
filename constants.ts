import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'zxlwq',
    title: '我的项目',
    icon: 'Layout',
    links: [
      { id: '1', title: 'Blog', url: 'https://cdn.zxlwq.dpdns.org', description: '科技刘-博客', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '2', title: 'Home', url: 'https://home.zxlwq.dpdns.org', description: '科技刘-主页', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '3', title: 'News', url: 'https://news.zxlwq.dpdns.org', description: '科技刘-新闻资讯', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '4', title: 'Qinglong', url: 'https://qg.zxlwq.dpdns.org', description: '青龙面板', icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/qinglong.svg' },
      { id: '5', title: 'N8N', url: 'https://base.zxlwq.dpdns.org', description: 'N8N 工作流', icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/n8n.svg' },
      { id: '6', title: 'Music', url: 'https://music.zxlwq.dpdns.org', description: '科技刘-音乐播放器', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '7', title: 'Player', url: 'https://player.zxlwq.dpdns.org', description: '科技刘-音乐播放器', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '8', title: 'Splayer', url: 'https://splayer.zxlwq.dpdns.org', description: '科技刘-网易云音乐', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '9', title: 'ZxlwqTV', url: 'https://ltv.zxlwq.dpdns.org', description: '科技刘-在线影视', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '10', title: 'LibreTV', url: 'https://tv.zxlwq.dpdns.org', description: 'LibreTV', icon: 'https://blog.wedp.dpdns.org/jpg/logo.webp' },
      { id: '11', title: 'SNav', url: 'https://snav.zxlwq.dpdns.org', description: '科技刘-搜索引擎', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '12', title: 'linklet', url: 'https://linklet.zxlwq.dpdns.org', description: '科技刘-短链生成', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '13', title: 'Drive', url: 'https://rz.zxlwq.dpdns.org', description: '科技刘-网盘', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '14', title: 'Pixpro', url: 'https://pixpro.zxlwq.dpdns.org', description: '科技刘-图床', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '15', title: 'TG-Image', url: 'https://tga.zxlwq.dpdns.org', description: '科技刘-图床', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '16', title: 'TG-Image', url: 'https://tg.zxlwq.dpdns.org', description: '科技刘-图床', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '17', title: 'Cover', url: 'https://cover.zxlwq.dpdns.org', description: '科技刘-封面生成', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '18', title: 'Mail', url: 'https://mail.zxlwq.dpdns.org', description: '科技刘-临时邮件', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '19', title: 'Tool', url: 'https://tool.zxlwq.dpdns.org', description: '科技刘-工具箱', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '20', title: 'AI-Image', url: 'https://ai.wedp.dpdns.org', description: '科技刘-文生图', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '21', title: 'Sub', url: 'https://sub.zxlwq.dpdns.org', description: '科技刘-订阅优选', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '22', title: 'Sub-Web', url: 'https://subw.zxlwq.dpdns.org', description: '科技刘-订阅转换', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '23', title: 'Base58', url: 'https://basea.zxlwq.dpdns.org', description: '科技刘-Base58', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '24', title: 'Community', url: 'https://zxlwq.discourse.group', description: '科技刘-社区', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '25', title: 'Web-ssh', url: 'https://webssh.zxlwq.dpdns.org', description: '科技刘-SSH', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '26', title: 'watermark', url: 'https://parse.zxlwq.dpdns.org', description: '科技刘-视频去水印', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '27', title: 'nz', url: 'https://nz.zxlwq.dpdns.org', description: '科技刘-哪吒监控', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
      { id: '28', title: 'state', url: 'https://uk.zxlwq.dpdns.org/status/zxlwq', description: '科技刘-项目状态', icon: 'https://blog.wedp.dpdns.org/jpg/favicon.ico' },
    ]
  },
  {
    id: 'dev',
    title: '托管平台',
    icon: 'Code',
    links: [
      { id: '1', title: 'GitHub', url: 'https://github.com', description: '代码托管平台' },
      { id: '2', title: 'EdgeOne', url: 'https://console.tencentcloud.com', description: '开发者问答社区' },
      { id: '3', title: 'Cloudflare', url: 'https://dash.cloudflare.com', description: '网络基础设施与安全' },
      { id: '4', title: 'Vercel', url: 'https://vercel.com', description: '原子化 CSS 框架' },
      { id: '5', title: 'Claw Cloud', url: 'https://ap-southeast-1.run.claw.cloud', description: '原子化 CSS 框架' },
      { id: '6', title: 'Hugging Face', url: 'https://huggingface.co', description: '原子化 CSS 框架' },
      { id: '7', title: 'Vercel', url: 'https://vercel.com', description: '原子化 CSS 框架' },
      { id: '8', title: 'Koyeb', url: 'https://app.koyeb.com', description: '原子化 CSS 框架' },
      { id: '9', title: 'Render', url: 'https://dashboard.render.com', description: '原子化 CSS 框架' },
      { id: '10', title: 'Zeabur', url: 'https://zeabur.com', description: '原子化 CSS 框架' },
      { id: '11', title: 'Docker Hub', url: 'https://hub.docker.com', description: '原子化 CSS 框架' },
      { id: '12', title: 'Firebase Studio', url: 'https://idx.google.com', description: '原子化 CSS 框架' },
      { id: '13', title: 'Firebase Hosting', url: 'https://console.firebase.google.com', description: '原子化 CSS 框架' },
      { id: '14', title: 'Cloud Studio ', url: 'https://cloudstudio.net', description: '原子化 CSS 框架' },
      { id: '15', title: 'Leapcell', url: 'https://leapcell.io', description: '原子化 CSS 框架' },
      { id: '16', title: 'Sealos', url: 'https://hzh.sealos.run', description: '原子化 CSS 框架' },
      { id: '17', title: 'GitLab', url: 'https://gitlab.com', description: '原子化 CSS 框架' },
    ]
  },
  {
    id: 'design',
    title: '设计与素材',
    icon: 'Palette',
    links: [
      { id: '5', title: 'Figma', url: 'https://figma.com', description: '在线界面设计工具' },
      { id: '6', title: 'Dribbble', url: 'https://dribbble.com', description: '设计灵感社区' },
      { id: '7', title: 'Unsplash', url: 'https://unsplash.com', description: '免费高清图库' },
    ]
  },
  {
    id: 'social',
    title: '社区与资讯',
    icon: 'Globe',
    links: [
      { id: '8', title: 'Reddit', url: 'https://reddit.com', description: '互联网头版' },
      { id: '9', title: 'Hacker News', url: 'https://news.ycombinator.com', description: '极客新闻' },
      { id: '10', title: 'Product Hunt', url: 'https://producthunt.com', description: '新产品发现' },
    ]
  },
  {
    id: 'tools',
    title: '常用工具',
    icon: 'Zap',
    links: [
      { id: '11', title: 'ChatGPT', url: 'https://chat.openai.com', description: 'AI 对话助手' },
      { id: '12', title: 'Google Gemini', url: 'https://gemini.google.com', description: '谷歌 AI 模型' },
      { id: '13', title: 'Excalidraw', url: 'https://excalidraw.com', description: '虚拟白板绘图' },
    ]
  }
];

export const SEARCH_ENGINES = {
  GOOGLE: 'https://www.google.com/search?q=',
  BING: 'https://www.bing.com/search?q=',
  DUCKDUCKGO: 'https://duckduckgo.com/?q=',
  BAIDU: 'https://www.baidu.com/s?wd=',
  SOGOU: 'https://www.sogou.com/web?query=',
  SO360: 'https://www.so.com/s?q=',
  ZHIHU: 'https://www.zhihu.com/search?q=',
  BILIBILI: 'https://search.bilibili.com/all?keyword=',
  GITHUB: 'https://github.com/search?q=',
  STACKOVERFLOW: 'https://stackoverflow.com/search?q=',
  MDN: 'https://developer.mozilla.org/zh-CN/search?q=',
  BAIKE: 'https://baike.baidu.com/search?word=',
};

export const SEARCH_ENGINE_OPTIONS = [
  { id: 'GOOGLE', label: 'Google', url: SEARCH_ENGINES.GOOGLE },
  { id: 'BING', label: 'Bing', url: SEARCH_ENGINES.BING },
  { id: 'DUCKDUCKGO', label: 'DuckDuckGo', url: SEARCH_ENGINES.DUCKDUCKGO },
  { id: 'BAIDU', label: '百度一下', url: SEARCH_ENGINES.BAIDU },
  { id: 'SOGOU', label: '搜狗搜索', url: SEARCH_ENGINES.SOGOU },
  { id: 'SO360', label: '360 搜索', url: SEARCH_ENGINES.SO360 },
  { id: 'ZHIHU', label: '知乎搜索', url: SEARCH_ENGINES.ZHIHU },
  { id: 'BILIBILI', label: '哔哩哔哩', url: SEARCH_ENGINES.BILIBILI },
  { id: 'GITHUB', label: 'GitHub', url: SEARCH_ENGINES.GITHUB },
  { id: 'STACKOVERFLOW', label: 'Stack Overflow', url: SEARCH_ENGINES.STACKOVERFLOW },
  { id: 'MDN', label: 'MDN Docs', url: SEARCH_ENGINES.MDN },
  { id: 'BAIKE', label: '百度百科', url: SEARCH_ENGINES.BAIKE },
];
