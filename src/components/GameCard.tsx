import { Star } from 'lucide-react';
import type { Game } from '@/lib/supabase';

export function GameCard({
  game,
  isFavorite,
  onFavoriteToggle,
  onClick,
}: {
  game: Game;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer active:scale-95 transition-transform"
    >
      <div className="relative">
        <img
          src={game.icon_url}
          alt={game.title}
          className="w-full aspect-square rounded-2xl object-cover bg-slate-700"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-orange-500/90 text-white'
              : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100'
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      </div>
      <h3 className="text-xs font-semibold text-white mt-1.5 truncate">{game.title}</h3>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-current" />
          {game.rating.toFixed(1)}
        </span>
        <span className="text-[10px] text-slate-600">{game.downloads}</span>
      </div>
    </div>
  );
}
