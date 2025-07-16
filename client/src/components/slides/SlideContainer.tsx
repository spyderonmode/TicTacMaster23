import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlideId } from '@/hooks/useSlideNavigation';
import { CompactStats } from '@/components/CompactStats';

interface SlideContainerProps {
  children: ReactNode;
  currentSlide: SlideId;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
  canGoBack: boolean;
  getAllSlides: () => SlideId[];
  getCurrentSlideIndex: () => number;
  navigateToSlide: (slideId: SlideId) => void;
  user?: any;
}

const slideLabels: Record<SlideId, string> = {
  'welcome': 'Welcome',
  'game-mode': 'Game Mode',
  'game-board': 'Game Board',
  'statistics': 'Statistics',
  'settings': 'Settings',
  'profile': 'Profile',
  'achievements': 'Achievements',
  'online-players': 'Online Players',
  'theme': 'Theme'
};

export const SlideContainer = ({
  children,
  currentSlide,
  onNext,
  onPrevious,
  onBack,
  canGoBack,
  getAllSlides,
  getCurrentSlideIndex,
  navigateToSlide,
  user
}: SlideContainerProps) => {
  const slides = getAllSlides();
  const currentIndex = getCurrentSlideIndex();
  const totalSlides = slides.length;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Slide Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {slideLabels[currentSlide]}
            </h2>
          </div>
          
          {/* Win Stats - Always visible on all slides */}
          <div className="flex items-center space-x-6">
            <CompactStats user={user} className="hidden md:flex" />
            
            {/* Slide Indicators */}
            <div className="flex items-center space-x-2">
              {slides.map((slideId, index) => (
                <button
                  key={slideId}
                  onClick={() => navigateToSlide(slideId)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  title={slideLabels[slideId]}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {currentIndex + 1} / {totalSlides}
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile Stats - Show below header on mobile */}
        <div className="md:hidden mt-3 pt-3 border-t border-slate-700">
          <CompactStats user={user} className="justify-center" />
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          {children}
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Use arrow keys to navigate</span>
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};