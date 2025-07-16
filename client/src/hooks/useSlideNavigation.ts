import { useState, useCallback } from 'react';

export type SlideId = 'welcome' | 'game-mode' | 'game-board' | 'statistics' | 'settings' | 'profile' | 'achievements' | 'online-players' | 'theme';

export interface SlideNavigationState {
  currentSlide: SlideId;
  slideHistory: SlideId[];
}

export const useSlideNavigation = (initialSlide: SlideId = 'welcome') => {
  const [state, setState] = useState<SlideNavigationState>({
    currentSlide: initialSlide,
    slideHistory: [initialSlide]
  });

  const navigateToSlide = useCallback((slideId: SlideId) => {
    setState(prev => ({
      currentSlide: slideId,
      slideHistory: [...prev.slideHistory, slideId]
    }));
  }, []);

  const goToNextSlide = useCallback(() => {
    const slides: SlideId[] = ['welcome', 'game-mode', 'game-board', 'statistics', 'settings', 'profile', 'achievements', 'online-players', 'theme'];
    const currentIndex = slides.indexOf(state.currentSlide);
    const nextIndex = (currentIndex + 1) % slides.length;
    navigateToSlide(slides[nextIndex]);
  }, [state.currentSlide, navigateToSlide]);

  const goToPreviousSlide = useCallback(() => {
    const slides: SlideId[] = ['welcome', 'game-mode', 'game-board', 'statistics', 'settings', 'profile', 'achievements', 'online-players', 'theme'];
    const currentIndex = slides.indexOf(state.currentSlide);
    const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    navigateToSlide(slides[prevIndex]);
  }, [state.currentSlide, navigateToSlide]);

  const goBack = useCallback(() => {
    if (state.slideHistory.length > 1) {
      const newHistory = state.slideHistory.slice(0, -1);
      const previousSlide = newHistory[newHistory.length - 1];
      setState({
        currentSlide: previousSlide,
        slideHistory: newHistory
      });
    }
  }, [state.slideHistory]);

  const getAllSlides = useCallback((): SlideId[] => {
    return ['welcome', 'game-mode', 'game-board', 'statistics', 'settings', 'profile', 'achievements', 'online-players', 'theme'];
  }, []);

  const getCurrentSlideIndex = useCallback(() => {
    const slides = getAllSlides();
    return slides.indexOf(state.currentSlide);
  }, [state.currentSlide, getAllSlides]);

  return {
    currentSlide: state.currentSlide,
    slideHistory: state.slideHistory,
    navigateToSlide,
    goToNextSlide,
    goToPreviousSlide,
    goBack,
    getAllSlides,
    getCurrentSlideIndex,
    canGoBack: state.slideHistory.length > 1
  };
};