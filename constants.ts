import { PresetRatio } from './types';

export const COMMON_PRESETS: PresetRatio[] = [
  { label: '16:9', width: 16, height: 9, description: '视频 / 电脑屏幕' },
  { label: '4:3', width: 4, height: 3, description: '传统屏幕 / iPad' },
  { label: '1:1', width: 1, height: 1, description: '头像 / 方图' },
  { label: '9:16', width: 9, height: 16, description: '短视频竖屏' },
  { label: '21:9', width: 21, height: 9, description: '超宽屏 / 电影' },
  { label: '3:2', width: 3, height: 2, description: '相机照片' },
  { label: '5:4', width: 5, height: 4, description: '打印 / 画幅' },
  { label: '2:3', width: 2, height: 3, description: '海报 / 竖图' },
  { label: '3:4', width: 3, height: 4, description: '电商主图' },
];
