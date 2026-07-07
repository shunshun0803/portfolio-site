import { useState } from 'react';
import { progressVideos, type ProgressVideo } from '../data/progress';
import { resolveAsset, youtubeId, youtubeThumb, youtubeEmbed } from '../utils/media';

function ProgressEntry({ v, index }: { v: ProgressVideo; index: number }) {
  const [playing, setPlaying] = useState(false);
  const accent = index % 2 === 0 ? '#FFD200' : '#FF7A18';
  const ytId = youtubeId(v.youtubeId);
  const src = resolveAsset(v.src);
  const poster = resolveAsset(v.poster);

  return (
    <div
      className="pixel-panel pixel-lift p-0 overflow-hidden"
      style={{ borderColor: accent }}
    >
      {/* Video / thumbnail only (16:9) */}
      <div className="relative w-full aspect-video bg-[#05050c]">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-4 border-t-4 z-10 pointer-events-none" style={{ borderColor: accent }} />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-4 border-b-4 z-10 pointer-events-none" style={{ borderColor: accent }} />

        {src ? (
          <video
            src={src}
            poster={poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onMouseEnter={(e) => e.currentTarget.play().catch(() => undefined)}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          />
        ) : ytId ? (
          playing ? (
            <iframe
              src={youtubeEmbed(ytId)}
              title={`progress-movie-${index + 1}`}
              className="w-full h-full"
              allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group/pl w-full h-full block relative"
              aria-label="動画を再生"
            >
              <img src={poster ?? youtubeThumb(ytId)} alt="" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover/pl:bg-black/20 transition-colors">
                <span
                  className="font-pixel text-[10px] text-black px-4 py-3"
                  style={{ background: accent, boxShadow: '3px 3px 0 #000' }}
                >
                  ▶ PLAY
                </span>
              </span>
            </button>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center font-pixel text-[9px] text-[#6b6a58]">
            NO SIGNAL
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgressLog() {
  if (progressVideos.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-pixel text-[10px] text-[#FFD200] text-glow-yellow">▶ 進捗ムービー</span>
        <span className="font-pixel text-[8px] text-[#6b6a58]">DEV LOG</span>
        <div className="h-1 flex-1" style={{ background: 'var(--line)' }} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {progressVideos.map((v, i) => (
          <ProgressEntry key={v.id} v={v} index={i} />
        ))}
      </div>
    </div>
  );
}
