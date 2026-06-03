# 纵横比大师

一个静态部署友好的图片、视频与屏幕尺寸比例计算器。支持输入宽高、切换常用比例、读取本地图片尺寸、复制计算结果和带参数的分享链接。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址是 `http://localhost:3000`。

## 构建检查

```bash
npm run deploy:check
```

该命令会先执行 TypeScript 检查，再生成 `dist` 静态产物。

## GitHub Pages 部署

项目已经包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后，GitHub Actions 会自动构建并发布 `dist`。

首次使用时，在 GitHub 仓库里打开：

1. `Settings` -> `Pages`
2. `Build and deployment` -> `Source`
3. 选择 `GitHub Actions`

`vite.config.ts` 已设置 `base: './'`，因此部署到用户主页、项目子路径或其他静态 Pages 平台时，资源路径都能正常工作。

## 其他 Pages 平台

Cloudflare Pages、Netlify、Vercel 等静态平台可使用：

- Build command: `npm run deploy:check`
- Output directory: `dist`
- Node.js version: `22`
