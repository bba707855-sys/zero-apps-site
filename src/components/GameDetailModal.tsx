import { X, Star, Download, Heart, Gamepad2 } from 'lucide-react';
import type { Game } from '@/lib/supabase';

export function GameDetailModal({
  game,
  isFavorite,
  onFavoriteToggle,
  onClose,
}: {
  game: Game;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onClose: () => void;
}) {
  const categoryLabels = {
    uzbek: "O'zbek O'yinlari",
    english: 'English Games',
    russian: 'Русские Игры',
  };

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-slate-900 rounded-t-3xl border-t border-slate-800 animate-slide-up">
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur-lg px-4 py-3 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <h2 className="text-sm font-semibold text-slate-400 mt-2">Game Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 transition-all mt-1"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-8">
          <div className="flex gap-4 mb-5">
            <img
              src={game.icon_url}
              alt={game.title}
              className="w-24 h-24 rounded-3xl object-cover bg-slate-700 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{game.title}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{game.developer}</p>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-slate-800 text-xs text-slate-400">
                {categoryLabels[game.category]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-5 px-2">
            <div className="flex flex-col items-center">
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-white">{game.rating.toFixed(1)}</span>
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Rating</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-white flex items-center gap-1">
                <Download className="w-4 h-4 text-slate-400" />
                {game.downloads}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Downloads</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-white flex items-center gap-1">
                <Gamepad2 className="w-4 h-4 text-slate-400" />
                #{game.rank}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Rank</span>
            </div>
          </div>

          <div className="flex gap-3 mb-5">
            <button
              onClick={onFavoriteToggle}
              className={`flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isFavorite
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? 'currentColor' : 'none'}
              />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>

          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white mb-2">About this game</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{game.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Download from</h3>
            <div className="space-y-3">
              <a
                href={game.play_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.628L15.391 12l2.307-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">GET IT ON</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>
              <a
                href={game.app_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.49 9.39c.55-1.03 1.84-1.73 3.2-1.8 1.29-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.66.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.81M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
