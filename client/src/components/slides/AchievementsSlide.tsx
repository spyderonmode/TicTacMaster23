import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Trophy, Star, Target, Zap, Crown, Medal, Award, Lock } from 'lucide-react';

interface AchievementSlideProps {
  onNavigate: (slideId: string) => void;
  onBack: () => void;
}

interface Achievement {
  id: string;
  achievementName: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  achievementType: string;
}

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'trophy': Trophy,
  'star': Star,
  'target': Target,
  'zap': Zap,
  'crown': Crown,
  'medal': Medal,
  'award': Award,
};

const ACHIEVEMENT_CATEGORIES = {
  'gameplay': { name: 'Gameplay', color: 'bg-blue-500' },
  'winning': { name: 'Winning Streaks', color: 'bg-green-500' },
  'social': { name: 'Social', color: 'bg-purple-500' },
  'dedication': { name: 'Dedication', color: 'bg-orange-500' },
  'special': { name: 'Special', color: 'bg-pink-500' },
};

export function AchievementsSlide({ onNavigate, onBack }: AchievementSlideProps) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch user achievements
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements', user?.userId || user?.id],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/achievements');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
        return [];
      }
    },
    enabled: !!(user?.userId || user?.id),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAchievementsByCategory = (category: string) => {
    if (!achievements || !Array.isArray(achievements)) return [];
    return (achievements as Achievement[]).filter((achievement: Achievement) => 
      achievement.achievementType?.toLowerCase().includes(category) || 
      achievement.description?.toLowerCase().includes(category)
    );
  };

  const getAllUnlockedAchievements = () => {
    if (!achievements || !Array.isArray(achievements)) return [];
    return (achievements as Achievement[]).filter((achievement: Achievement) => achievement.isUnlocked);
  };

  const getAchievementProgress = () => {
    if (!achievements || !Array.isArray(achievements)) return 0;
    const unlocked = (achievements as Achievement[]).filter((achievement: Achievement) => achievement.isUnlocked).length;
    return (unlocked / achievements.length) * 100;
  };

  const renderAchievement = (achievement: Achievement) => {
    const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] || Trophy;
    
    return (
      <Card 
        key={achievement.id} 
        className={`relative transition-all duration-200 hover:scale-105 ${
          achievement.isUnlocked 
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700' 
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
        }`}
      >
        {achievement.isUnlocked && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Unlocked
            </Badge>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              achievement.isUnlocked 
                ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {achievement.isUnlocked ? (
                <IconComponent className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${
                achievement.isUnlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
              }`}>
                {achievement.achievementName}
              </h3>
              <p className={`text-sm mt-1 ${
                achievement.isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Unlocked on {formatDate(achievement.unlockedAt)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Achievements</h1>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const unlockedAchievements = getAllUnlockedAchievements();
  const progress = getAchievementProgress();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">
                {unlockedAchievements.length} of {Array.isArray(achievements) ? achievements.length : 0} achievements unlocked
              </span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {progress.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="mb-2"
        >
          All Achievements
        </Button>
        <Button
          variant={selectedCategory === 'unlocked' ? "default" : "outline"}
          onClick={() => setSelectedCategory('unlocked')}
          className="mb-2"
        >
          <Star className="w-4 h-4 mr-2" />
          Unlocked ({unlockedAchievements.length})
        </Button>
        <Button
          variant={selectedCategory === 'locked' ? "default" : "outline"}
          onClick={() => setSelectedCategory('locked')}
          className="mb-2"
        >
          <Lock className="w-4 h-4 mr-2" />
          Locked ({Array.isArray(achievements) ? achievements.length - unlockedAchievements.length : 0})
        </Button>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && selectedCategory === null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements
                .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
                .slice(0, 6)
                .map(renderAchievement)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'unlocked' && 'Unlocked Achievements'}
            {selectedCategory === 'locked' && 'Locked Achievements'}
            {selectedCategory === null && 'All Achievements'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements && Array.isArray(achievements) && achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(achievements as Achievement[])
                .filter((achievement: Achievement) => {
                  if (selectedCategory === 'unlocked') return achievement.isUnlocked;
                  if (selectedCategory === 'locked') return !achievement.isUnlocked;
                  return true;
                })
                .map(renderAchievement)}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Achievements Yet</h3>
              <p className="text-gray-500 mb-4">Start playing games to unlock achievements!</p>
              <Button onClick={() => onNavigate('game-mode')}>
                Start Playing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={() => onNavigate('profile')}>
          <Trophy className="w-4 h-4 mr-2" />
          View Profile
        </Button>
        <Button variant="outline" onClick={() => onNavigate('statistics')}>
          <Target className="w-4 h-4 mr-2" />
          Game Statistics
        </Button>
        <Button variant="outline" onClick={() => onNavigate('game-mode')}>
          <Zap className="w-4 h-4 mr-2" />
          Play Game
        </Button>
      </div>
    </div>
  );
}