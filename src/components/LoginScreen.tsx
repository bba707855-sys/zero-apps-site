import { Flame } from 'lucide-react';

export function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 pb-28">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <Flame className="w-12 h-12 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">ShflameStore</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Discover and download the best games
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-1.5">Welcome</h2>
          <p className="text-sm text-slate-400 mb-4">
            Sign in to save your favorite games and access your profile.
          </p>
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Uzbek, English & Russian Top 20 Games
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Download from Play Store & App Store
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            Save your favorite games
          </div>
        </div>
      </div>
    </div>
  );
}
