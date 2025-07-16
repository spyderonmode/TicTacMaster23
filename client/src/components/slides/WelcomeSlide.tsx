import { 
  User, 
  GamepadIcon, 
  Eye, 
  Trophy,
  Settings,
  Palette,
  Users,
  BarChart3,
  Play,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WelcomeSlideProps {
  user: any;
  onNavigateToGameMode: () => void;
  onNavigate?: (slideId: string) => void;
  spectatorMode?: boolean;
  onSpectatorModeChange?: (enabled: boolean) => void;
}

interface NavigationItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  badge?: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'game-mode',
    icon: Play,
    title: 'Play Game',
    description: 'Start a new game with AI or friends',
    color: 'from-blue-500 to-blue-600',
    badge: 'Popular'
  },
  {
    id: 'online-players',
    icon: Users,
    title: 'Online Players',
    description: 'See who\'s online and challenge them',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'profile',
    icon: User,
    title: 'My Profile',
    description: 'View and edit your profile information',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'achievements',
    icon: Trophy,
    title: 'Achievements',
    description: 'Track your progress and unlock rewards',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'statistics',
    icon: BarChart3,
    title: 'Statistics',
    description: 'View your detailed game statistics',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'theme',
    icon: Palette,
    title: 'Themes',
    description: 'Customize your gaming experience',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'Settings',
    description: 'Configure game preferences',
    color: 'from-gray-500 to-gray-600'
  }
];

export const WelcomeSlide = ({ 
  user, 
  onNavigateToGameMode, 
  onNavigate,
  spectatorMode = false, 
  onSpectatorModeChange 
}: WelcomeSlideProps) => {

  const handleNavigationClick = (itemId: string) => {
    if (itemId === 'game-mode') {
      onNavigateToGameMode();
    } else if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <GamepadIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">TicTacMaster23</h1>
              <p className="text-lg text-gray-300">Strategic 3x5 Tic-Tac-Toe</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white text-center">Welcome Back!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture and Info */}
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarImage src={user?.profilePicture || user?.profileImageUrl} />
                    <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {getInitials(user?.displayName || user?.firstName || user?.username || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-white">
                    {user?.displayName || user?.firstName || user?.username || 'Player'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {user?.email || 'Welcome back!'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">0</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">0</div>
                    <div className="text-xs text-gray-400">Games</div>
                  </div>
                </div>

                {/* Spectator Mode Toggle */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Spectator Mode</div>
                        <div className="text-xs text-gray-400">Prefer to watch games</div>
                      </div>
                    </div>
                    <Switch
                      checked={spectatorMode}
                      onCheckedChange={onSpectatorModeChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">What would you like to do?</h2>
              <p className="text-gray-300">Choose from the options below to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {NAVIGATION_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="bg-slate-800/90 border-slate-700 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-200 cursor-pointer group hover:scale-105"
                    onClick={() => handleNavigationClick(item.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center text-blue-400 text-sm font-medium">
                        <span>Open</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Start Section */}
            <Card className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Play?</h3>
                    <p className="text-gray-300">Jump straight into a game with our quick start option</p>
                  </div>
                  <Button 
                    onClick={onNavigateToGameMode}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Quick Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};