import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Check,
  Sparkles,
  Eye,
  Settings
} from 'lucide-react';

interface ThemeSlideProps {
  onNavigate: (slideId: string) => void;
  onBack: () => void;
}

interface ThemePreview {
  name: string;
  background: string;
  cardBackground: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
}

const THEME_PREVIEWS: Record<string, ThemePreview> = {
  'dark': {
    name: 'Dark',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800',
    textColor: 'text-gray-100',
    accentColor: 'bg-blue-600',
    borderColor: 'border-gray-700'
  },
  'light': {
    name: 'Light',
    background: 'bg-gray-50',
    cardBackground: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'bg-blue-600',
    borderColor: 'border-gray-200'
  },
  'blue': {
    name: 'Ocean Blue',
    background: 'bg-blue-950',
    cardBackground: 'bg-blue-900',
    textColor: 'text-blue-50',
    accentColor: 'bg-blue-500',
    borderColor: 'border-blue-700'
  },
  'green': {
    name: 'Forest Green',
    background: 'bg-green-950',
    cardBackground: 'bg-green-900',
    textColor: 'text-green-50',
    accentColor: 'bg-green-500',
    borderColor: 'border-green-700'
  },
  'purple': {
    name: 'Royal Purple',
    background: 'bg-purple-950',
    cardBackground: 'bg-purple-900',
    textColor: 'text-purple-50',
    accentColor: 'bg-purple-500',
    borderColor: 'border-purple-700'
  },
  'sunset': {
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-900 to-pink-900',
    cardBackground: 'bg-orange-800/50',
    textColor: 'text-orange-50',
    accentColor: 'bg-orange-500',
    borderColor: 'border-orange-600'
  },
  'neon': {
    name: 'Neon',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800',
    textColor: 'text-cyan-100',
    accentColor: 'bg-cyan-500',
    borderColor: 'border-cyan-400'
  }
};

export function ThemeSlide({ onNavigate, onBack }: ThemeSlideProps) {
  const { currentTheme, setTheme, themes, isDarkMode, setIsDarkMode } = useTheme();
  const { toast } = useToast();
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setPreviewTheme(null);
    toast({
      title: "Theme Applied",
      description: `Switched to ${THEME_PREVIEWS[themeName]?.name || themeName} theme`,
    });
  };

  const handlePreview = (themeName: string) => {
    setPreviewTheme(previewTheme === themeName ? null : themeName);
  };

  const renderThemePreview = (themeName: string, themeData: ThemePreview) => {
    const isActive = currentTheme === themeName;
    const isPreviewing = previewTheme === themeName;
    
    return (
      <Card 
        key={themeName}
        className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
          isActive ? 'ring-2 ring-primary ring-offset-2' : ''
        } ${isPreviewing ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
        onClick={() => handleThemeChange(themeName)}
      >
        {isActive && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-green-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        )}
        
        {isPreviewing && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-orange-500 text-white">
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Badge>
          </div>
        )}

        <div className={`p-4 rounded-t-lg ${themeData.background}`}>
          <div className={`p-3 rounded-lg ${themeData.cardBackground} ${themeData.borderColor} border`}>
            <div className={`text-sm font-medium ${themeData.textColor} mb-2`}>
              {themeData.name}
            </div>
            <div className="flex gap-2 mb-2">
              <div className={`w-4 h-4 rounded ${themeData.accentColor}`}></div>
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
            </div>
            <div className={`text-xs ${themeData.textColor} opacity-75`}>
              Sample text content
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{themeData.name}</h3>
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(themeName);
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              {isPreviewing ? 'Stop' : 'Preview'}
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleThemeChange(themeName);
              }}
              disabled={isActive}
            >
              {isActive ? 'Active' : 'Apply'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="w-8 h-8" />
          Theme Settings
        </h1>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Dark Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Display Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <Label htmlFor="dark-mode" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark appearance
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5" />
                <div>
                  <Label className="text-base font-medium">
                    System Theme
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Follow your system's theme preference
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Current Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {THEME_PREVIEWS[currentTheme]?.name || 'Custom Theme'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Active theme for your gaming experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Available Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(THEME_PREVIEWS).map(([themeName, themeData]) =>
              renderThemePreview(themeName, themeData)
            )}
          </div>
        </CardContent>
      </Card>

      {/* Theme Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Animation Effects
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable smooth transitions and animations
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  High Contrast
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Reduced Motion
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimize motion for accessibility
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={() => onNavigate('settings')}>
          <Settings className="w-4 h-4 mr-2" />
          More Settings
        </Button>
        <Button variant="outline" onClick={() => onNavigate('welcome')}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Changes
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setTheme('dark');
            toast({ title: "Theme Reset", description: "Reset to default dark theme" });
          }}
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
}