import { ChevronRight } from 'lucide-react';
import type { Game } from '@/lib/supabase';
import { GameCard } from '@/components/GameCard';

export function CategorySection({
  title,
  flag,
  games,
  favorites,
  onFavoriteToggle,
  onGameClick,
  onSeeAll,
}: {
  title: string;
  flag: string;
  games: Game[];
  favorites: Set<string>;
  onFavoriteToggle: (gameId: string) => void;
  onGameClick: (game: Game) => void;
  onSeeAll: () => void;
}) {
  if (games.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">{flag}</span>
          {title}
        </h2>
        <button
          onClick={onSeeAll}
          className="text-xs text-orange-500 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          See All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {games.slice(0, 10).map((game) => (
          <div key={game.id} className="flex-shrink-0 w-28">
            <GameCard
              game={game}
              isFavorite={favorites.has(game.id)}
              onFavoriteToggle={() => onFavoriteToggle(game.id)}
              onClick={() => onGameClick(game)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
