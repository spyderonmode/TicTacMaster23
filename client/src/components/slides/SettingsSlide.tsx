import { useState } from 'react';
import { ProfileManager } from '@/components/ProfileManager';
import { ThemeSelector } from '@/components/ThemeSelector';
import { AchievementModal } from '@/components/AchievementModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  User, 
  Palette, 
  Trophy, 
  LogOut, 
  Volume2, 
  VolumeX,
  Bell,
  BellOff,
  Gamepad2
} from 'lucide-react';
import { logout } from "@/lib/firebase";

interface SettingsSlideProps {
  user: any;
}

export const SettingsSlide = ({ user }: SettingsSlideProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <Settings className="w-8 h-8 text-blue-500" />
            <span>Settings & Profile</span>
          </h2>
          <p className="text-gray-300">Manage your account and game preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {user?.displayName || user?.firstName || user?.username || 'Player'}
                </h3>
                <p className="text-gray-400 mb-3">
                  {user?.email || 'No email provided'}
                </p>
                <Button 
                  onClick={() => setShowProfile(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Theme</h4>
                  <p className="text-gray-400 text-sm">Customize the app's appearance</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const event = new CustomEvent('openThemeSelector');
                    window.dispatchEvent(event);
                  }}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Change Theme
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Preferences */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5" />
              <span>Game Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Sound Effects</h4>
                  <p className="text-gray-400 text-sm">Enable or disable game sounds</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`${soundEnabled ? 'bg-green-700 border-green-600' : 'bg-slate-700 border-slate-600'} text-white hover:bg-opacity-80`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      Disabled
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive game and match notifications</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`${notificationsEnabled ? 'bg-green-700 border-green-600' : 'bg-slate-700 border-slate-600'} text-white hover:bg-opacity-80`}
                >
                  {notificationsEnabled ? (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4 mr-2" />
                      Disabled
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Sign Out</h4>
                    <p className="text-gray-400 text-sm">Sign out of your account</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="bg-red-700 border-red-600 text-white hover:bg-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">About TicTacMaster23</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="text-white">Web Application</span>
              </div>
              <div className="flex justify-between">
                <span>Game Type:</span>
                <span className="text-white">3x5 Tic-Tac-Toe</span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-gray-400">
                  TicTacMaster23 - Advanced tic-tac-toe with AI, multiplayer, and social features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileManager 
        user={user}
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <AchievementModal 
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ThemeSelector />
    </div>
  );
};