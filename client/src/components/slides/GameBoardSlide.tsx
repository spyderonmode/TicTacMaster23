import { GameBoard } from '@/components/GameBoard';
import { PlayerList } from '@/components/PlayerList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';

interface GameBoardSlideProps {
  currentGame: any;
  onGameOver: (result: any) => void;
  selectedMode: 'ai' | 'pass-play' | 'online';
  user: any;
  currentRoom: any;
  onNavigateToWelcome: () => void;
  onPlayAgain: () => void;
  isCreatingGame: boolean;
}

export const GameBoardSlide = ({
  currentGame,
  onGameOver,
  selectedMode,
  user,
  currentRoom,
  onNavigateToWelcome,
  onPlayAgain,
  isCreatingGame
}: GameBoardSlideProps) => {
  if (!currentGame) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🎮</div>
          <h3 className="text-xl font-semibold">No Active Game</h3>
          <p className="text-gray-400">Go back to select a game mode and start playing.</p>
          <Button 
            onClick={onNavigateToWelcome}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board Section */}
          <div className="lg:col-span-2">
            {/* Game Info Header */}
            <div className="mb-6 text-center space-y-2">
              <h2 className="text-2xl font-bold">Game in Progress</h2>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span>Game ID: {currentGame.id}</span>
                <span>•</span>
                <span>Room: {currentRoom?.code || 'Local'}</span>
                <span>•</span>
                <span>Mode: {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}</span>
              </div>
            </div>

            {/* Game Board */}
            <div className="bg-slate-800 rounded-lg p-6">
              <GameBoard 
                key={currentGame?.id}
                game={currentGame}
                onGameOver={onGameOver}
                gameMode={selectedMode}
                user={user}
              />
            </div>

            {/* Game Actions */}
            <div className="mt-6 flex justify-center space-x-4">
              <Button 
                onClick={onNavigateToWelcome}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Home className="w-4 h-4 mr-2" />
                Main Menu
              </Button>
              
              {/* Only show New Game button for AI and pass-play modes, not for online mode */}
              {selectedMode !== 'online' && (
                <Button 
                  onClick={onPlayAgain}
                  disabled={isCreatingGame}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCreatingGame ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Game
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Game Rules */}
            <Card className="mt-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Game Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span><strong>Horizontal Win:</strong> Get 4 symbols in a row horizontally</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span><strong>Vertical Win:</strong> Get 3 symbols in a column vertically</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                  <span><strong>Diagonal Win:</strong> Get 3 symbols diagonally (positions 5, 10, 15 restricted)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                  <span><strong>Grid Layout:</strong> 3 rows × 5 columns (positions 1-15)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                  <span><strong>Valid Diagonal Patterns:</strong> [1,7,13], [2,8,14], [3,7,11], [4,8,12]</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  <span><strong>Restricted:</strong> No diagonal wins using the rightmost column (5, 10, 15)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Players */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Current Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Player X */}
                  <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                      X
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {currentGame.playerXInfo?.displayName || 
                         currentGame.playerXInfo?.firstName || 
                         currentGame.playerXInfo?.username || 
                         'Player X'}
                      </div>
                      <div className="text-xs text-gray-400">Player X</div>
                    </div>
                    {currentGame.currentPlayer === 'X' && (
                      <div className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Current Turn
                      </div>
                    )}
                  </div>

                  {/* Player O */}
                  <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold">
                      O
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {currentGame.playerOInfo?.displayName || 
                         currentGame.playerOInfo?.firstName || 
                         currentGame.playerOInfo?.username || 
                         'Player O'}
                      </div>
                      <div className="text-xs text-gray-400">Player O</div>
                    </div>
                    {currentGame.currentPlayer === 'O' && (
                      <div className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Current Turn
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Status */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Game Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white capitalize">{currentGame.status || 'Active'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Turn:</span>
                    <span className="text-white">Player {currentGame.currentPlayer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Move Count:</span>
                    <span className="text-white">{Object.keys(currentGame.board || {}).length}</span>
                  </div>
                  {selectedMode === 'ai' && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI Difficulty:</span>
                      <span className="text-white capitalize">{currentGame.aiDifficulty || 'Medium'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Room Players (for online mode) */}
            {currentRoom && (
              <PlayerList roomId={currentRoom.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};