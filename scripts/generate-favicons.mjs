import { favicons } from 'favicons';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'icon.png');
const outputDir = path.join(root, 'public');

const configuration = {
  path: './',
  appName: '宽高比大师',
  appShortName: '宽高比大师',
  appDescription: '静态部署友好的图片、视频与屏幕尺寸比例计算器。',
  background: '#0284c7',
  theme_color: '#0284c7',
  lang: 'zh-CN',
  display: 'standalone',
  start_url: './',
  scope: './',
  manifestMaskable: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: false,
    yandex: false,
  },
};

const { images, files } = await favicons(source, configuration);

await fs.mkdir(outputDir, { recursive: true });

for (const image of images) {
  await fs.writeFile(path.join(outputDir, image.name), image.contents);
}

for (const file of files) {
  let contents = file.contents;
  if (file.name === 'manifest.webmanifest') {
    contents = Buffer.from(
      contents.toString().replaceAll('"src": "/', '"src": "./'),
    );
  }
  await fs.writeFile(path.join(outputDir, file.name), contents);
}

await fs.copyFile(source, path.join(outputDir, 'icon.png'));

console.log(`Generated ${images.length} images and ${files.length} files in public/`);
