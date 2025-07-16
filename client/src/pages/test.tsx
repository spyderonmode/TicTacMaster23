import { useSlideNavigation } from "@/hooks/useSlideNavigation";
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

// Mock user for testing
const mockUser = {
  id: "test-user-123",
  username: "testuser",
  displayName: "Test User",
  email: "test@example.com",
  isEmailVerified: true
};

export default function TestPage() {
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

  // Render current slide content
  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 'welcome':
        return (
          <WelcomeSlide 
            user={mockUser}
            onNavigateToGameMode={() => navigateToSlide('game-mode')}
            onNavigate={navigateToSlide}
            spectatorMode={false}
            onSpectatorModeChange={() => {}}
          />
        );
      case 'game-mode':
        return (
          <GameModeSlide
            selectedMode="ai"
            onModeChange={() => {}}
            aiDifficulty="medium"
            onDifficultyChange={() => {}}
            currentRoom={null}
            onRoomJoin={() => {}}
            onRoomLeave={() => {}}
            onCreateRoom={() => {}}
            onGameStart={() => {}}
            user={mockUser}
            onNavigateToGameBoard={() => navigateToSlide('game-board')}
            onMatchmakingStart={() => {}}
            isMatchmaking={false}
            onlineUserCount={0}
          />
        );
      case 'game-board':
        return (
          <GameBoardSlide
            currentGame={null}
            onGameOver={() => {}}
            selectedMode="ai"
            user={mockUser}
            currentRoom={null}
            onNavigateToWelcome={() => navigateToSlide('welcome')}
            onPlayAgain={() => {}}
            isCreatingGame={false}
          />
        );
      case 'statistics':
        return (
          <StatisticsSlide user={mockUser} />
        );
      case 'settings':
        return (
          <SettingsSlide 
            user={mockUser}
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
            user={mockUser}
            onNavigateToGameMode={() => navigateToSlide('game-mode')}
            onNavigate={navigateToSlide}
            spectatorMode={false}
            onSpectatorModeChange={() => {}}
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
      user={mockUser}
    >
      {renderCurrentSlide()}
    </SlideContainer>
  );
}