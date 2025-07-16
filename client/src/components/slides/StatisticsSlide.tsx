import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react';

interface UserStats {
  wins: number;
  losses: number;
  draws: number;
  bestStreak?: number;
  avgGameTime?: string;
  aiWins?: number;
  localWins?: number;
  onlineWins?: number;
}

interface StatisticsSlideProps {
  user: any;
}

export const StatisticsSlide = ({ user }: StatisticsSlideProps) => {
  const { data: userStatsData, isLoading } = useQuery({
    queryKey: ["/api/users/online-stats"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/users/online-stats", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        return data as UserStats;
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        return {
          wins: 0,
          losses: 0,
          draws: 0,
          bestStreak: 0,
          avgGameTime: 'N/A',
          aiWins: 0,
          localWins: 0,
          onlineWins: 0,
        } as UserStats;
      }
    },
    enabled: !!user,
  });

  const userStats = userStatsData || {
    wins: 0,
    losses: 0,
    draws: 0,
    bestStreak: 0,
    avgGameTime: 'N/A',
    aiWins: 0,
    localWins: 0,
    onlineWins: 0,
  };

  const totalGames = (userStats.wins || 0) + (userStats.losses || 0) + (userStats.draws || 0);
  const winRate = totalGames > 0 ? ((userStats.wins || 0) / totalGames * 100).toFixed(1) : '0.0';

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold flex items-center justify-center space-x-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span>Game Statistics</span>
            </h2>
            <p className="text-gray-300">Loading your stats...</p>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Game Statistics</span>
          </h2>
          <p className="text-gray-300">Track your progress and achievements</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {userStats.wins || 0}
              </div>
              <div className="text-sm text-blue-200">Wins</div>
              <Trophy className="w-6 h-6 text-blue-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {userStats.losses || 0}
              </div>
              <div className="text-sm text-red-200">Losses</div>
              <Target className="w-6 h-6 text-red-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {userStats.draws || 0}
              </div>
              <div className="text-sm text-yellow-200">Draws</div>
              <div className="w-6 h-6 bg-yellow-400 rounded-full mx-auto mt-2"></div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">
                {totalGames}
              </div>
              <div className="text-sm text-gray-200">Total</div>
              <Clock className="w-6 h-6 text-gray-400 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(parseFloat(winRate), 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold">{winRate}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Played:</span>
                <span className="text-white font-semibold">{totalGames}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best Streak:</span>
                <span className="text-white font-semibold">{userStats.bestStreak || 0}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg. Game Time:</span>
                <span className="text-white font-semibold">{userStats.avgGameTime || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Game Mode Breakdown */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Game Mode Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">vs AI:</span>
                  </div>
                  <span className="text-white">{userStats.aiWins || 0} wins</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400">Pass & Play:</span>
                  </div>
                  <span className="text-white">{userStats.localWins || 0} wins</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-400">Online:</span>
                  </div>
                  <span className="text-white">{userStats.onlineWins || 0} wins</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Win Achievement */}
              <div className={`p-4 rounded-lg border-2 ${(userStats.wins || 0) > 0 ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-700 border-slate-600'}`}>
                <div className="text-center space-y-2">
                  <div className="text-2xl">🏆</div>
                  <div className="font-semibold">First Victory</div>
                  <div className="text-xs text-gray-400">Win your first game</div>
                  {(userStats.wins || 0) > 0 && (
                    <div className="text-xs text-yellow-500 font-semibold">UNLOCKED</div>
                  )}
                </div>
              </div>

              {/* Win Streak Achievement */}
              <div className={`p-4 rounded-lg border-2 ${(userStats.wins || 0) >= 5 ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-700 border-slate-600'}`}>
                <div className="text-center space-y-2">
                  <div className="text-2xl">🔥</div>
                  <div className="font-semibold">Hot Streak</div>
                  <div className="text-xs text-gray-400">Win 5 games in a row</div>
                  {(userStats.wins || 0) >= 5 && (
                    <div className="text-xs text-blue-500 font-semibold">UNLOCKED</div>
                  )}
                </div>
              </div>

              {/* Games Played Achievement */}
              <div className={`p-4 rounded-lg border-2 ${totalGames >= 10 ? 'bg-green-900/20 border-green-500' : 'bg-slate-700 border-slate-600'}`}>
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎮</div>
                  <div className="font-semibold">Dedicated Player</div>
                  <div className="text-xs text-gray-400">Play 10 games</div>
                  {totalGames >= 10 && (
                    <div className="text-xs text-green-500 font-semibold">UNLOCKED</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game History */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Game history feature coming soon!</p>
              <p className="text-sm">Your recent games will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};