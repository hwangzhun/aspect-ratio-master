import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  Clipboard,
  Copy,
  Divide,
  Hash,
  Image as ImageIcon,
  Link as LinkIcon,
  Monitor,
  RefreshCw,
  Ruler,
  Upload,
  X,
} from 'lucide-react';
import { COMMON_PRESETS } from './constants';
import { StatCard } from './components/StatCard';
import { Visualizer } from './components/Visualizer';
import { calculateRatio, formatDecimal } from './utils/math';
import { RatioResult } from './types';

type LockMode = 'width' | 'height';
type CopyTarget = 'summary' | 'link' | null;

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const MAX_DIMENSION = 999999;

const clampDimension = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.round(value), MAX_DIMENSION);
};

const readInitialDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  const params = new URLSearchParams(window.location.search);
  const width = clampDimension(Number(params.get('w')));
  const height = clampDimension(Number(params.get('h')));

  if (width > 0 && height > 0) {
    return { width, height };
  }

  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
};

function App() {
  const initialDimensions = useMemo(readInitialDimensions, []);
  const initialRatio = useMemo(
    () => calculateRatio(initialDimensions.width, initialDimensions.height),
    [initialDimensions.height, initialDimensions.width],
  );

  const [width, setWidth] = useState<number>(initialDimensions.width);
  const [height, setHeight] = useState<number>(initialDimensions.height);
  const [ratioW, setRatioW] = useState<string>(String(initialRatio.widthRatio));
  const [ratioH, setRatioH] = useState<string>(String(initialRatio.heightRatio));
  const [lockMode, setLockMode] = useState<LockMode>('width');
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [result, setResult] = useState<RatioResult>(calculateRatio(initialDimensions.width, initialDimensions.height));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResult(calculateRatio(width, height));

    if (typeof window === 'undefined' || width <= 0 || height <= 0) return;

    const params = new URLSearchParams(window.location.search);
    params.set('w', String(width));
    params.set('h', String(height));
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [width, height]);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const applyDimensions = (rawWidth: number, rawHeight: number) => {
    const w = clampDimension(rawWidth);
    const h = clampDimension(rawHeight);
    const ratio = calculateRatio(w, h);
    setWidth(w);
    setHeight(h);
    setRatioW(String(ratio.widthRatio));
    setRatioH(String(ratio.heightRatio));
  };

  const handleWidthChange = (value: number) => {
    applyDimensions(value, height);
  };

  const handleHeightChange = (value: number) => {
    applyDimensions(width, value);
  };

  const applyRatio = (nextRatioW: string, nextRatioH: string, nextLockMode = lockMode) => {
    const parsedRatioW = Number(nextRatioW);
    const parsedRatioH = Number(nextRatioH);

    if (parsedRatioW <= 0 || parsedRatioH <= 0 || !Number.isFinite(parsedRatioW) || !Number.isFinite(parsedRatioH)) {
      return;
    }

    if (nextLockMode === 'width') {
      setHeight(clampDimension(width * (parsedRatioH / parsedRatioW)));
      return;
    }

    setWidth(clampDimension(height * (parsedRatioW / parsedRatioH)));
  };

  const handleRatioWChange = (value: string) => {
    setRatioW(value);
    applyRatio(value, ratioH);
  };

  const handleRatioHChange = (value: string) => {
    setRatioH(value);
    applyRatio(ratioW, value);
  };

  const handlePresetClick = (presetWidth: number, presetHeight: number) => {
    const nextRatioW = String(presetWidth);
    const nextRatioH = String(presetHeight);
    setRatioW(nextRatioW);
    setRatioH(nextRatioH);
    applyRatio(nextRatioW, nextRatioH);
  };

  const handleLockModeChange = (nextMode: LockMode) => {
    setLockMode(nextMode);
    applyRatio(ratioW, ratioH, nextMode);
  };

  const handleSwap = () => {
    setWidth(height);
    setHeight(width);
    setRatioW(ratioH);
    setRatioH(ratioW);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const image = new Image();
    image.onload = () => {
      applyDimensions(
        image.naturalWidth || image.width,
        image.naturalHeight || image.height,
      );
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setWidth(DEFAULT_WIDTH);
    setHeight(DEFAULT_HEIGHT);
    setRatioW('16');
    setRatioH('9');
    setLockMode('width');
  };

  const copyText = async (text: string, target: CopyTarget) => {
    await navigator.clipboard.writeText(text);
    setCopied(target);
  };

  const copySummary = () => {
    copyText(`${width} x ${height} px | ${result.text} | ${formatDecimal(result.decimal)}`, 'summary');
  };

  const copyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('w', String(width));
    url.searchParams.set('h', String(height));
    copyText(url.toString(), 'link');
  };

  const isClipboardAvailable = typeof navigator !== 'undefined' && Boolean(navigator.clipboard);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="./icon.png"
              alt=""
              width={36}
              height={36}
              className="rounded-lg shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">宽高比大师</h1>
              <p className="hidden sm:block text-xs text-slate-500">图片、视频与屏幕尺寸比例计算器</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex h-10 w-10 items-center justify-center text-slate-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              title="重置"
              aria-label="重置"
            >
              <RefreshCw size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 h-10 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Upload size={16} aria-hidden="true" />
              <span className="hidden sm:inline">读取图片</span>
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <section className="lg:col-span-5 space-y-6" aria-label="比例计算控制区">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Monitor className="text-primary-600" size={19} aria-hidden="true" />
                  尺寸同步
                </h2>
                <div className="inline-flex bg-slate-100 rounded-lg p-1" aria-label="锁定计算基准">
                  <button
                    onClick={() => handleLockModeChange('width')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      lockMode === 'width' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    锁宽
                  </button>
                  <button
                    onClick={() => handleLockModeChange('height')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      lockMode === 'height' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    锁高
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                    像素尺寸
                  </label>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="relative min-w-0">
                      <input
                        type="number"
                        min="0"
                        max={MAX_DIMENSION}
                        value={width || ''}
                        onChange={(event) => handleWidthChange(Number(event.target.value))}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-base sm:text-lg text-slate-800"
                        placeholder="宽度"
                        aria-label="宽度"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">W</span>
                    </div>

                    <button
                      onClick={handleSwap}
                      className="h-11 w-11 inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-colors active:scale-95"
                      title="交换宽高"
                      aria-label="交换宽高"
                    >
                      <ArrowLeftRight size={18} aria-hidden="true" />
                    </button>

                    <div className="relative min-w-0">
                      <input
                        type="number"
                        min="0"
                        max={MAX_DIMENSION}
                        value={height || ''}
                        onChange={(event) => handleHeightChange(Number(event.target.value))}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-base sm:text-lg text-slate-800"
                        placeholder="高度"
                        aria-label="高度"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">H</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-100" />
                  <span className="flex-shrink mx-4 text-slate-300" aria-hidden="true">
                    <LinkIcon size={14} />
                  </span>
                  <div className="flex-grow border-t border-slate-100" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                    纵横比
                  </label>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="relative min-w-0">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={ratioW}
                        onChange={(event) => handleRatioWChange(event.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-base sm:text-lg text-slate-800"
                        placeholder="宽"
                        aria-label="比例宽度"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">W</span>
                    </div>

                    <button
                      onClick={handleSwap}
                      className="h-11 w-11 inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-700 transition-colors active:scale-95"
                      title="交换宽高"
                      aria-label="交换比例宽高"
                    >
                      <ArrowLeftRight size={18} aria-hidden="true" />
                    </button>

                    <div className="relative min-w-0">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={ratioH}
                        onChange={(event) => handleRatioHChange(event.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-base sm:text-lg text-slate-800"
                        placeholder="高"
                        aria-label="比例高度"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">H</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={copySummary}
                    disabled={!isClipboardAvailable}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    {copied === 'summary' ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}
                    {copied === 'summary' ? '已复制' : '复制结果'}
                  </button>
                  <button
                    onClick={copyLink}
                    disabled={!isClipboardAvailable}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    {copied === 'link' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {copied === 'link' ? '已复制' : '复制链接'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="text-primary-600" size={16} aria-hidden="true" />
                常用比例
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset.width, preset.height)}
                    className="group flex min-h-16 flex-col items-center justify-center p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-primary-50 hover:border-primary-200 transition-colors text-center"
                    title={preset.description}
                  >
                    <span className="text-sm font-bold text-slate-800 group-hover:text-primary-700 font-mono">{preset.label}</span>
                    <span className="mt-1 text-[10px] text-slate-400 leading-tight line-clamp-2">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 flex flex-col gap-6" aria-label="计算结果">
            <div className="flex-grow bg-white rounded-lg shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-col min-h-[430px] lg:min-h-[560px]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Ruler className="text-primary-600" size={19} aria-hidden="true" />
                  形状预览
                </h2>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-[11px] font-mono text-slate-600">W {Math.round(width)}px</span>
                  <span className="px-2.5 py-1.5 rounded-md bg-slate-100 text-[11px] font-mono text-slate-600">H {Math.round(height)}px</span>
                </div>
              </div>
              <div className="flex-grow flex items-center justify-center overflow-hidden">
                <Visualizer width={width} height={height} ratioText={result.text} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="简化比例" value={result.text} icon={Hash} highlight subtext="最简整数比" />
              <StatCard label="比例系数" value={formatDecimal(result.decimal)} icon={Divide} subtext="宽度 / 高度" />
              <StatCard label="最大公约数" value={result.gcdValue} icon={X} subtext="像素 GCD" />
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} 宽高比大师 · By Hwanghzun</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
