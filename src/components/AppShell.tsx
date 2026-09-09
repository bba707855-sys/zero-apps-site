import { useState, useEffect, type ReactNode } from 'react';
import { Home, Gamepad2, User, Search, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Game } from '@/lib/supabase';
import { GameCard } from '@/components/GameCard';
import { GameDetailModal } from '@/components/GameDetailModal';
import { LoginScreen } from '@/components/LoginScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { CategorySection } from '@/components/CategorySection';

type Tab = 'home' | 'categories' | 'profile';

const CATEGORY_INFO = {
  uzbek: { label: 'O\'zbek O\'yinlari', flag: '🇺🇿', color: 'from-emerald-500 to-teal-600' },
  english: { label: 'English Games', flag: '🇬🇧', color: 'from-blue-500 to-indigo-600' },
  russian: { label: 'Русские Игры', flag: '🇷🇺', color: 'from-red-500 to-rose-600' },
} as const;

export function AppShell() {
  const [tab, setTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<'uzbek' | 'english' | 'russian'>('uzbek');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user, profile, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    supabase
      .from('games')
      .select('*')
      .order('rank', { ascending: true })
      .then(({ data }) => {
        setGames((data as Game[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    supabase
      .from('favorites')
      .select('game_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavorites(new Set((data ?? []).map((f: { game_id: string }) => f.game_id)));
      });
  }, [user]);

  const toggleFavorite = async (gameId: string) => {
    if (!user) return;
    if (favorites.has(gameId)) {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('game_id', gameId);
    } else {
      setFavorites((prev) => new Set(prev).add(gameId));
      await supabase.from('favorites').insert({ user_id: user.id, game_id: gameId });
    }
  };

  const filteredGames = searchQuery
    ? games.filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

  const gamesByCategory = (cat: string) => games.filter((g) => g.category === cat);
  const favoriteGames = games.filter((g) => favorites.has(g.id));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Flame className="w-16 h-16 text-orange-500 animate-pulse" />
          <p className="text-slate-400 text-sm">Loading ShflameStore...</p>
        </div>
      </div>
    );
  }

  const renderContent = (): ReactNode => {
    if (tab === 'profile') {
      if (user) {
        return (
          <ProfileScreen
            profile={profile}
            favorites={favoriteGames}
            onGameClick={setSelectedGame}
            onSignOut={signOut}
          />
        );
      }
      return <LoginScreen onSignIn={signInWithGoogle} />;
    }

    if (tab === 'categories') {
      return (
        <div className="px-4 pt-4 pb-28 space-y-6">
          <div className="flex gap-2 sticky top-0 z-10 bg-slate-950/80 backdrop-blur-lg -mx-4 px-4 py-3 border-b border-slate-800">
            {(Object.keys(CATEGORY_INFO) as ('uzbek' | 'english' | 'russian')[]).map((key) => {
              const info = CATEGORY_INFO[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="mr-1.5">{info.flag}</span>
                  {key === 'uzbek' ? "O'zbek" : key === 'english' ? 'English' : 'Русский'}
                </button>
              );
            })}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {CATEGORY_INFO[selectedCategory].flag} {CATEGORY_INFO[selectedCategory].label}
            </h2>
            <p className="text-slate-400 text-sm mb-4">Top 20 Games</p>
            {loading ? (
              <LoadingGrid />
            ) : (
              <div className="space-y-3">
                {gamesByCategory(selectedCategory).map((game, index) => (
                  <RankedListItem
                    key={game.id}
                    game={game}
                    rank={index + 1}
                    isFavorite={favorites.has(game.id)}
                    onFavoriteToggle={() => toggleFavorite(game.id)}
                    onClick={() => setSelectedGame(game)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Home
    return (
      <div className="px-4 pt-4 pb-28 space-y-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-slate-800/80 text-white placeholder-slate-500 pl-11 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>

        {searchQuery ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-3">
              Search Results ({filteredGames.length})
            </h2>
            {filteredGames.length === 0 ? (
              <p className="text-slate-400 text-center py-12">No games found</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.has(game.id)}
                    onFavoriteToggle={() => toggleFavorite(game.id)}
                    onClick={() => setSelectedGame(game)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {user && favoriteGames.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Your Favorites
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {favoriteGames.map((game) => (
                    <div key={game.id} className="flex-shrink-0 w-32">
                      <GameCard
                        game={game}
                        isFavorite={true}
                        onFavoriteToggle={() => toggleFavorite(game.id)}
                        onClick={() => setSelectedGame(game)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(Object.keys(CATEGORY_INFO) as ('uzbek' | 'english' | 'russian')[]).map((key) => (
              <CategorySection
                key={key}
                title={CATEGORY_INFO[key].label}
                flag={CATEGORY_INFO[key].flag}
                games={gamesByCategory(key)}
                favorites={favorites}
                onFavoriteToggle={toggleFavorite}
                onGameClick={setSelectedGame}
                onSeeAll={() => {
                  setSelectedCategory(key);
                  setTab('categories');
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white max-w-md mx-auto relative">
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">ShflameStore</h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Game Store</p>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setTab('profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-700 hover:border-orange-500 transition-all"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </button>
          )}
        </div>
      </header>

      <main>{renderContent()}</main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around z-30">
        <TabButton icon={Home} label="Home" active={tab === 'home'} onClick={() => setTab('home')} />
        <TabButton
          icon={Gamepad2}
          label="Categories"
          active={tab === 'categories'}
          onClick={() => setTab('categories')}
        />
        <TabButton
          icon={User}
          label="Profile"
          active={tab === 'profile'}
          onClick={() => setTab('profile')}
        />
      </nav>

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          isFavorite={favorites.has(selectedGame.id)}
          onFavoriteToggle={() => toggleFavorite(selectedGame.id)}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all ${
        active ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function RankedListItem({
  game,
  rank,
  isFavorite,
  onFavoriteToggle,
  onClick,
}: {
  game: Game;
  rank: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="w-7 text-center">
        <span
          className={`text-lg font-bold ${
            rank <= 3 ? 'text-orange-500' : 'text-slate-500'
          }`}
        >
          {rank}
        </span>
      </div>
      <div className="relative">
        <img
          src={game.icon_url}
          alt={game.title}
          className="w-14 h-14 rounded-2xl object-cover bg-slate-700"
          loading="lazy"
        />
        {rank <= 3 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Flame className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-white truncate">{game.title}</h3>
        <p className="text-xs text-slate-500 truncate">{game.developer}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-amber-400 flex items-center gap-0.5">
            ★ {game.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-600">{game.downloads}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle();
        }}
        className={`p-2 rounded-lg transition-all ${
          isFavorite ? 'text-orange-500' : 'text-slate-600 hover:text-slate-400'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </button>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl animate-pulse">
          <div className="w-7 h-7 bg-slate-700 rounded" />
          <div className="w-14 h-14 bg-slate-700 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-700 rounded w-3/4" />
            <div className="h-2 bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
