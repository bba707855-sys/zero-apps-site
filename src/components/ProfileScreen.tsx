import { LogOut, Mail, Calendar, Star, Heart, User } from 'lucide-react';
import type { Game, Profile } from '@/lib/supabase';
import { GameCard } from '@/components/GameCard';

export function ProfileScreen({
  profile,
  favorites,
  onGameClick,
  onSignOut,
}: {
  profile: Profile | null;
  favorites: Game[];
  onGameClick: (game: Game) => void;
  onSignOut: () => void;
}) {
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen px-4 pt-6 pb-28">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-700 mb-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-white">{profile?.full_name || 'User'}</h1>
        <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
          <Mail className="w-3.5 h-3.5" />
          {profile?.email}
        </p>
        {joinDate && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3" />
            Joined {joinDate}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 text-center">
          <Heart className="w-6 h-6 text-orange-500 mx-auto mb-1.5" fill="currentColor" />
          <p className="text-2xl font-bold text-white">{favorites.length}</p>
          <p className="text-xs text-slate-400">Favorites</p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 text-center">
          <Star className="w-6 h-6 text-amber-400 mx-auto mb-1.5" fill="currentColor" />
          <p className="text-2xl font-bold text-white">60</p>
          <p className="text-xs text-slate-400">Total Games</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-orange-500" fill="currentColor" />
          Favorite Games
        </h2>
        {favorites.length === 0 ? (
          <div className="bg-slate-800/30 rounded-2xl p-8 text-center">
            <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No favorites yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Tap the heart icon on any game to save it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {favorites.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={true}
                onFavoriteToggle={() => {}}
                onClick={() => onGameClick(game)}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-red-500/10 hover:text-red-400 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
