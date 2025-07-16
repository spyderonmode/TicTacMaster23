import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Minus } from 'lucide-react';

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

interface CompactStatsProps {
  user: any;
  className?: string;
}

export const CompactStats = ({ user, className = "" }: CompactStatsProps) => {
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
      <div className={`flex items-center space-x-3 text-sm text-gray-400 ${className}`}>
        <div className="animate-pulse">Loading stats...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-4 text-sm ${className}`}>
      {/* Wins */}
      <div className="flex items-center space-x-1 text-green-400">
        <Trophy className="w-4 h-4" />
        <span className="font-semibold">{userStats.wins || 0}</span>
      </div>
      
      {/* Losses */}
      <div className="flex items-center space-x-1 text-red-400">
        <Target className="w-4 h-4" />
        <span className="font-semibold">{userStats.losses || 0}</span>
      </div>
      
      {/* Draws */}
      <div className="flex items-center space-x-1 text-yellow-400">
        <Minus className="w-4 h-4" />
        <span className="font-semibold">{userStats.draws || 0}</span>
      </div>
      
      {/* Win Rate */}
      <div className="flex items-center space-x-1 text-blue-400 border-l border-slate-600 pl-3">
        <span className="text-xs text-gray-400">WR:</span>
        <span className="font-semibold">{winRate}%</span>
      </div>
    </div>
  );
};