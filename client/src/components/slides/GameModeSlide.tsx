import { GameModeSelector } from '@/components/GameModeSelector';
import { RoomManager } from '@/components/RoomManager';
import { OnlineUsersModal } from '@/components/OnlineUsersModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, Users } from 'lucide-react';
import { useState } from 'react';

interface GameModeSlideProps {
  selectedMode: 'ai' | 'pass-play' | 'online';
  onModeChange: (mode: 'ai' | 'pass-play' | 'online') => void;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  currentRoom: any;
  onRoomJoin: (room: any) => void;
  onRoomLeave: () => void;
  onCreateRoom: () => void;
  onGameStart: (game: any) => void;
  user: any;
  onNavigateToGameBoard: () => void;
  onMatchmakingStart: () => void;
  isMatchmaking: boolean;
  onlineUserCount: number;
}

export const GameModeSlide = ({
  selectedMode,
  onModeChange,
  aiDifficulty,
  onDifficultyChange,
  currentRoom,
  onRoomJoin,
  onRoomLeave,
  onCreateRoom,
  onGameStart,
  user,
  onNavigateToGameBoard,
  onMatchmakingStart,
  isMatchmaking,
  onlineUserCount
}: GameModeSlideProps) => {
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const handleModeSelection = (mode: 'ai' | 'pass-play' | 'online') => {
    onModeChange(mode);
    if (mode === 'ai' || mode === 'pass-play') {
      // Auto-navigate to game board for local modes
      setTimeout(() => {
        onNavigateToGameBoard();
      }, 500);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Choose Your Game Mode</h2>
          <p className="text-gray-300">Select how you want to play TicTacMaster23</p>
        </div>

        {/* Game Mode Selection */}
        <div className="max-w-2xl mx-auto">
          <GameModeSelector 
            selectedMode={selectedMode}
            onModeChange={handleModeSelection}
            aiDifficulty={aiDifficulty}
            onDifficultyChange={onDifficultyChange}
          />
        </div>

        {/* Online Multiplayer Section */}
        {selectedMode === 'online' && (
          <div className="space-y-6">
            {/* Online Players */}
            <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Online Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Online Players</h4>
                    <p className="text-gray-400 text-sm">View who's currently online and chat with them</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowOnlineUsers(true)}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {onlineUserCount} Online
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Quick Match */}
            <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Quick Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
                  <div className="text-center space-y-3">
                    <div className="text-sm font-semibold text-blue-300">Find a Match</div>
                    <p className="text-xs text-gray-400">
                      Get matched with another player instantly
                    </p>
                    <Button 
                      onClick={onMatchmakingStart}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isMatchmaking}
                    >
                      {isMatchmaking ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Find Match
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Management */}
            <div className="max-w-2xl mx-auto">
              <RoomManager 
                currentRoom={currentRoom}
                onRoomJoin={onRoomJoin}
                onRoomLeave={onRoomLeave}
                onCreateRoom={onCreateRoom}
                onGameStart={onGameStart}
                gameMode={selectedMode}
                user={user}
              />
            </div>

            {/* Instructions for Online Mode */}
            {!currentRoom && (
              <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">How to Play Online</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Quick Match:</strong> Click "Find Match" to be automatically paired with another player</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span><strong>Create Room:</strong> Make a private room and share the code with friends</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                    <span><strong>Join Room:</strong> Enter a friend's room code to join their game</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigate to Game Board when room is ready */}
            {currentRoom && (
              <div className="text-center">
                <Button 
                  onClick={onNavigateToGameBoard}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Game Board
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Instructions for Local Modes */}
        {(selectedMode === 'ai' || selectedMode === 'pass-play') && (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedMode === 'ai' ? 'AI Mode Instructions' : 'Pass & Play Instructions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              {selectedMode === 'ai' ? (
                <>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>You are X:</strong> You always play as X and go first</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                    <span><strong>AI is O:</strong> The AI will automatically make moves as O</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                    <span><strong>Difficulty:</strong> {aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)} - Change anytime in settings</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Two Players:</strong> Take turns on the same device</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span><strong>Player 1 (X):</strong> Goes first and plays as X</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                    <span><strong>Player 2 (O):</strong> Goes second and plays as O</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Continue Button for Local Modes */}
        {(selectedMode === 'ai' || selectedMode === 'pass-play') && (
          <div className="text-center">
            <Button 
              onClick={onNavigateToGameBoard}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Start Playing
            </Button>
          </div>
        )}
      </div>

      {/* Online Users Modal */}
      <OnlineUsersModal 
        open={showOnlineUsers}
        onClose={() => setShowOnlineUsers(false)}
        currentRoom={currentRoom}
        user={user}
      />
    </div>
  );
};