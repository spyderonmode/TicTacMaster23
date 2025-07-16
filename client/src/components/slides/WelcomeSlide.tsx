import { User, GamepadIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeSlideProps {
  user: any;
  onNavigateToGameMode: () => void;
}

export const WelcomeSlide = ({ user, onNavigateToGameMode }: WelcomeSlideProps) => {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            <GamepadIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Welcome to TicTacMaster23</h1>
          <p className="text-xl text-gray-300">
            The ultimate 3x5 tic-tac-toe experience with AI and multiplayer support
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-slate-800 border-slate-700 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-center space-x-2">
              <User className="w-5 h-5" />
              <span>Player Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {user?.displayName || user?.firstName || user?.username || 'Player'}
                </h3>
                <p className="text-sm text-gray-400">
                  {user?.email || 'Welcome back!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold">AI Opponents</h3>
            <p className="text-sm text-gray-400">Play against intelligent AI</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold">Multiplayer</h3>
            <p className="text-sm text-gray-400">Challenge friends online</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">Statistics</h3>
            <p className="text-sm text-gray-400">Track your progress</p>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onNavigateToGameMode}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};