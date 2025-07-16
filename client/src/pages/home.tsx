import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { 
  SlideContainer, 
  WelcomeSlide, 
  GameModeSlide, 
  GameBoardSlide, 
  StatisticsSlide, 
  SettingsSlide,
  ProfileSlide,
  AchievementsSlide,
  OnlinePlayersSlide,
  ThemeSlide
} from "@/components/slides";
import { CreateRoomModal } from "@/components/CreateRoomModal";
import { GameOverModal } from "@/components/GameOverModal";
import { EmailVerificationModal } from "@/components/EmailVerificationModal";
import { MatchmakingModal } from "@/components/MatchmakingModal";
import { ChatPopup } from "@/components/ChatPopup";

export default function Home() {
  const { user } = useAuth();
  const { isConnected, lastMessage, joinRoom, leaveRoom, sendMessage } = useWebSocket();
  const { toast } = useToast();
  
  // Slide navigation
  const {
    currentSlide,
    navigateToSlide,
    goToNextSlide,
    goToPreviousSlide,
    goBack,
    getAllSlides,
    getCurrentSlideIndex,
    canGoBack
  } = useSlideNavigation();

  // Game state
  const [selectedMode, setSelectedMode] = useState<'ai' | 'pass-play' | 'online'>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [onlineUserCount, setOnlineUserCount] = useState(0);

  // Chat state
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatPartner, setChatPartner] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Spectator mode preference
  const [spectatorMode, setSpectatorMode] = useState(false);

  const { data: userStats } = useQuery({
    queryKey: ["/api/users/online-stats"],
    enabled: !!user,
  });

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousSlide();
      } else if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'Escape' && canGoBack) {
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPreviousSlide, goToNextSlide, goBack, canGoBack]);

  // Check if email verification is required
  useEffect(() => {
    if (user && user.email && !user.isEmailVerified) {
      setShowEmailVerification(true);
    }
  }, [user]);

  // WebSocket message handling
  useEffect(() => {
    if (lastMessage) {
      console.log('🎮 Home received WebSocket message:', lastMessage);
      switch (lastMessage.type) {
        case 'online_users_update':
          setOnlineUserCount(lastMessage.count);
          break;
        case 'game_started':
          if (lastMessage.roomId === currentRoom?.id) {
            const newGame = {
              ...lastMessage.game,
              status: 'active',
              board: {},
              currentPlayer: 'X',
              timestamp: Date.now()
            };
            setCurrentGame(newGame);
            setIsCreatingGame(false);
            setShowGameOver(false);
            setGameResult(null);
            // Auto-navigate to game board when game starts
            navigateToSlide('game-board');
          }
          break;
        case 'move':
          if (currentGame && lastMessage.gameId === currentGame.id) {
            setCurrentGame(prevGame => {
              // Only update if this is a newer move (prevent out-of-order updates)
              const messageTimestamp = lastMessage.timestamp || Date.now();
              const currentTimestamp = prevGame.timestamp || 0;
              
              if (messageTimestamp >= currentTimestamp) {
                const updatedGame = {
                  ...prevGame,
                  board: lastMessage.board,
                  currentPlayer: lastMessage.currentPlayer,
                  lastMove: lastMessage.position,
                  playerXInfo: lastMessage.playerXInfo || prevGame.playerXInfo,
                  playerOInfo: lastMessage.playerOInfo || prevGame.playerOInfo,
                  timestamp: messageTimestamp
                };
                console.log('🔄 Move synchronized successfully:', lastMessage.position);
                return updatedGame;
              } else {
                console.log('⏰ Ignoring outdated move message');
                return prevGame;
              }
            });
          }
          break;
        case 'winning_move':
          if (currentGame && lastMessage.gameId === currentGame.id) {
            setCurrentGame(prevGame => ({
              ...prevGame,
              board: lastMessage.board,
              currentPlayer: lastMessage.currentPlayer,
              lastMove: lastMessage.position,
              winningPositions: lastMessage.winningPositions,
              timestamp: Date.now()
            }));
          }
          break;
        case 'game_over':
          if (currentGame && lastMessage.gameId === currentGame.id) {
            const gameResult = {
              winner: lastMessage.winner,
              condition: lastMessage.condition,
              board: lastMessage.board,
              winnerInfo: lastMessage.winnerInfo,
              playerXInfo: lastMessage.playerXInfo || currentGame.playerXInfo,
              playerOInfo: lastMessage.playerOInfo || currentGame.playerOInfo,
              game: {
                ...currentGame,
                gameMode: currentGame.gameMode || 'online'
              }
            };
            setGameResult(gameResult);
            setShowGameOver(true);
          }
          break;
        case 'match_found':
          setIsMatchmaking(false);
          setShowMatchmaking(false);
          handleRoomJoin(lastMessage.room);
          toast({
            title: "Match Found!",
            description: "You've been matched with an opponent. Game starting...",
          });
          break;
        case 'room_ended':
          if (currentRoom && lastMessage.roomId === currentRoom.id) {
            toast({
              title: "Room Ended",
              description: `${lastMessage.playerName || 'A player'} left the room. Refreshing page...`,
              duration: 2000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          break;
        case 'chat_message_received':
          // Handle incoming chat message and show popup
          if (lastMessage.message) {
            const { senderId, senderName, message, timestamp } = lastMessage.message;
            
            // Don't show popup for own messages
            if (senderId !== user?.userId && senderId !== user?.id) {
              const newMessage = {
                id: `${senderId}-${timestamp}`,
                senderId,
                senderName,
                message,
                timestamp
              };
              
              // Add message to chat history
              setChatMessages(prev => [...prev, newMessage]);
              
              // Set up chat partner and show popup
              setChatPartner({
                id: senderId,
                name: senderName
              });
              setShowChatPopup(true);
              
              toast({
                title: "New Message",
                description: `${senderName}: ${message}`,
                duration: 3000,
              });
            }
          }
          break;
      }
    }
  }, [lastMessage, currentGame, currentRoom, user, navigateToSlide]);

  // Room and game handlers
  const handleRoomJoin = (room: any) => {
    setCurrentRoom(room);
    joinRoom(room.id);
    navigateToSlide('game-mode'); // Navigate to game mode to show room status
  };

  const handleRoomLeave = () => {
    if (currentRoom) {
      leaveRoom(currentRoom.id);
      setCurrentRoom(null);
    }
  };

  const resetToMainMenu = () => {
    if (currentRoom) {
      const leaveMessage = {
        type: 'leave_room',
        roomId: currentRoom.id,
        userId: user?.userId || user?.id,
        playerName: user?.displayName || user?.firstName || user?.username || 'Player'
      };
      sendMessage(leaveMessage);
      setTimeout(() => {
        setCurrentRoom(null);
        setCurrentGame(null);
        setShowGameOver(false);
        setGameResult(null);
        setIsCreatingGame(false);
        setSelectedMode('ai');
        navigateToSlide('welcome');
      }, 100);
    } else {
      setCurrentRoom(null);
      setCurrentGame(null);
      setShowGameOver(false);
      setGameResult(null);
      setIsCreatingGame(false);
      setSelectedMode('ai');
      navigateToSlide('welcome');
    }
  };

  const handleGameStart = (game: any) => {
    setCurrentGame(game);
    navigateToSlide('game-board');
  };

  const handleMatchmakingStart = () => {
    setShowMatchmaking(true);
    setIsMatchmaking(true);
  };

  const handleMatchmakingClose = () => {
    setShowMatchmaking(false);
    setIsMatchmaking(false);
  };

  const handleMatchFound = (room: any) => {
    setIsMatchmaking(false);
    handleRoomJoin(room);
  };

  // Chat handlers
  const handleSendChatMessage = (message: string) => {
    // Add the sent message to local chat history
    if (chatPartner && user) {
      const newMessage = {
        id: `${user.userId || user.id}-${Date.now()}`,
        senderId: user.userId || user.id,
        senderName: user.displayName || user.firstName || user.username || 'You',
        message,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, newMessage]);
    }
  };

  const handleCloseChatPopup = () => {
    setShowChatPopup(false);
    // Keep chat partner and messages for when reopened
  };

  // Initialize local game for AI and pass-play modes
  const initializeLocalGame = () => {
    if (selectedMode === 'ai' || selectedMode === 'pass-play') {
      const newGame = {
        id: `local-game-${Date.now()}`,
        board: {},
        currentPlayer: 'X',
        status: 'active',
        gameMode: selectedMode,
        aiDifficulty,
        playerXId: user?.userId || user?.id,
        playerOId: selectedMode === 'ai' ? 'ai' : 'player2',
        playerXInfo: {
          displayName: 'Player X',
          firstName: 'Player X',
          username: 'Player X'
        },
        playerOInfo: selectedMode === 'ai' ? {
          displayName: 'AI',
          firstName: 'AI',
          username: 'AI'
        } : {
          displayName: 'Player O',
          firstName: 'Player O',
          username: 'Player O'
        }
      };
      setCurrentGame(newGame);
    }
  };

  // Auto-initialize game when switching to AI or pass-play mode
  useEffect(() => {
    if (!currentGame && (selectedMode === 'ai' || selectedMode === 'pass-play')) {
      initializeLocalGame();
    }
  }, [selectedMode, currentGame, user]);

  const handleGameOver = (result: any) => {
    const simpleResult = {
      winner: result?.winner || null,
      winnerName: result?.winnerName || (result?.winner === 'X' ? 'Player X' : result?.winner === 'O' ? 'AI' : null),
      condition: result?.condition || 'unknown'
    };
    setGameResult(simpleResult);
    setShowGameOver(true);
  };

  const handlePlayAgain = async () => {
    if (isCreatingGame) return;

    setIsCreatingGame(true);
    setShowGameOver(false);
    setGameResult(null);

    if (selectedMode === 'online' && currentRoom) {
      try {
        setCurrentGame(null);
        const response = await fetch(`/api/rooms/${currentRoom.id}/start-game`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const newGame = await response.json();
          const gameWithFreshStatus = {
            ...newGame,
            status: 'active',
            board: {},
            currentPlayer: 'X'
          };
          setCurrentGame(gameWithFreshStatus);
        } else {
          setCurrentGame(null);
        }
      } catch (error) {
        console.error('Error starting new game:', error);
        setCurrentGame(null);
      }
    } else {
      const newGame = {
        id: `local-game-${Date.now()}`,
        board: {},
        currentPlayer: 'X',
        status: 'active',
        gameMode: selectedMode,
        aiDifficulty,
        playerXId: user?.userId || user?.id,
        playerOId: selectedMode === 'ai' ? 'ai' : 'player2',
        playerXInfo: {
          displayName: 'Player X',
          firstName: 'Player X',
          username: 'Player X'
        },
        playerOInfo: selectedMode === 'ai' ? {
          displayName: 'AI',
          firstName: 'AI',
          username: 'AI'
        } : {
          displayName: 'Player O',
          firstName: 'Player O',
          username: 'Player O'
        }
      };
      setCurrentGame(newGame);
    }

    setTimeout(() => {
      setIsCreatingGame(false);
    }, 1000);
  };



  // Render current slide content
  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 'welcome':
        return (
          <WelcomeSlide 
            user={user}
            onNavigateToGameMode={() => navigateToSlide('game-mode')}
            onNavigate={navigateToSlide}
            spectatorMode={spectatorMode}
            onSpectatorModeChange={setSpectatorMode}
          />
        );
      case 'game-mode':
        return (
          <GameModeSlide
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            aiDifficulty={aiDifficulty}
            onDifficultyChange={setAiDifficulty}
            currentRoom={currentRoom}
            onRoomJoin={handleRoomJoin}
            onRoomLeave={handleRoomLeave}
            onCreateRoom={() => setShowCreateRoom(true)}
            onGameStart={handleGameStart}
            user={user}
            onNavigateToGameBoard={() => navigateToSlide('game-board')}
            onMatchmakingStart={handleMatchmakingStart}
            isMatchmaking={isMatchmaking}
            onlineUserCount={onlineUserCount}
          />
        );
      case 'game-board':
        return (
          <GameBoardSlide
            currentGame={currentGame}
            onGameOver={handleGameOver}
            selectedMode={selectedMode}
            user={user}
            currentRoom={currentRoom}
            onNavigateToWelcome={() => navigateToSlide('welcome')}
            onPlayAgain={handlePlayAgain}
            isCreatingGame={isCreatingGame}
          />
        );
      case 'statistics':
        return (
          <StatisticsSlide user={user} />
        );
      case 'settings':
        return (
          <SettingsSlide 
            user={user}
          />
        );
      case 'profile':
        return (
          <ProfileSlide 
            onNavigate={navigateToSlide}
            onBack={goBack}
          />
        );
      case 'achievements':
        return (
          <AchievementsSlide 
            onNavigate={navigateToSlide}
            onBack={goBack}
          />
        );
      case 'online-players':
        return (
          <OnlinePlayersSlide 
            onNavigate={navigateToSlide}
            onBack={goBack}
          />
        );
      case 'theme':
        return (
          <ThemeSlide 
            onNavigate={navigateToSlide}
            onBack={goBack}
          />
        );
      default:
        return (
          <WelcomeSlide 
            user={user}
            onNavigateToGameMode={() => navigateToSlide('game-mode')}
          />
        );
    }
  };

  return (
    <SlideContainer
      currentSlide={currentSlide}
      onNext={goToNextSlide}
      onPrevious={goToPreviousSlide}
      onBack={goBack}
      canGoBack={canGoBack}
      getAllSlides={getAllSlides}
      getCurrentSlideIndex={getCurrentSlideIndex}
      navigateToSlide={navigateToSlide}
    >
      {renderCurrentSlide()}

      {/* Modals */}
      <CreateRoomModal 
        open={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onRoomCreated={handleRoomJoin}
      />

      <GameOverModal 
        open={showGameOver}
        onClose={() => setShowGameOver(false)}
        result={gameResult}
        onPlayAgain={handlePlayAgain}
        isCreatingGame={isCreatingGame}
        onMainMenu={resetToMainMenu}
      />

      {showEmailVerification && user?.email && (
        <EmailVerificationModal 
          email={user.email}
          onClose={() => setShowEmailVerification(false)}
        />
      )}

      <MatchmakingModal 
        open={showMatchmaking}
        onClose={handleMatchmakingClose}
        onMatchFound={handleMatchFound}
        user={user}
      />

      <ChatPopup
        isOpen={showChatPopup}
        onClose={handleCloseChatPopup}
        chatPartner={chatPartner}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        user={user}
      />
    </SlideContainer>
  );
}