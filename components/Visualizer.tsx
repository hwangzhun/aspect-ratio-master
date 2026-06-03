import React from 'react';

interface VisualizerProps {
  width: number;
  height: number;
  ratioText: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ width, height, ratioText }) => {
  const isValid = width > 0 && height > 0;
  const aspectRatio = width / height;

  const shapeStyle: React.CSSProperties = {
    aspectRatio: `${width} / ${height}`,
    boxSizing: 'border-box',
    flex: '0 0 auto',
    ...(aspectRatio >= 1
      ? {
          width: '100%',
          maxHeight: '100%',
        }
      : {
          height: '100%',
          maxWidth: '100%',
        }),
  };

  return (
    <div className="relative h-full w-full min-h-[300px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner">
      <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
        {Array.from({ length: 400 }).map((_, index) => (
          <div key={index} className="border-r border-b border-slate-900" />
        ))}
      </div>

      {isValid ? (
        <>
          <div className="absolute inset-x-10 inset-y-12 flex items-center justify-center">
            <div
              className="rounded-md bg-primary-600 shadow-2xl shadow-primary-500/20 transition-all duration-300 ease-in-out"
              style={shapeStyle}
              aria-label={`预览比例 ${ratioText}`}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-md bg-slate-950/75 px-3 py-2 text-center text-white shadow-lg backdrop-blur-sm">
              <span className="block text-lg sm:text-2xl font-bold leading-none">{ratioText}</span>
              <span className="mt-1 block text-[10px] sm:text-xs font-normal opacity-80 uppercase tracking-widest">PREVIEW</span>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded bg-white/75 px-2 py-1 text-center text-[10px] font-mono text-slate-500 shadow-sm pointer-events-none whitespace-nowrap">
            WIDTH: {Math.round(width)}px
          </div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-center rounded bg-white/75 px-2 py-1 text-center text-[10px] font-mono text-slate-500 shadow-sm pointer-events-none whitespace-nowrap">
            HEIGHT: {Math.round(height)}px
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">
          请输入有效尺寸以查看预览
        </div>
      )}
    </div>
  );
};
