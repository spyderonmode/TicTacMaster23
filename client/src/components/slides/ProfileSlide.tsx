import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User, Mail, Calendar, Trophy, GamepadIcon } from 'lucide-react';

interface ProfileSlideProps {
  onNavigate: (slideId: string) => void;
  onBack: () => void;
}

export function ProfileSlide({ onNavigate, onBack }: ProfileSlideProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    displayName: user?.displayName || '',
    firstName: user?.firstName || '',
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?.userId || user?.id],
    queryFn: () => apiRequest('GET', `/api/users/${user?.userId || user?.id}/stats`),
    enabled: !!(user?.userId || user?.id),
  });

  // Fetch online game stats
  const { data: onlineStats } = useQuery({
    queryKey: ['onlineStats', user?.userId || user?.id],
    queryFn: () => apiRequest('GET', '/api/users/online-stats'),
    enabled: !!(user?.userId || user?.id),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { displayName: string; firstName: string }) => {
      return apiRequest('PUT', '/api/profile', data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile({
      displayName: user?.displayName || '',
      firstName: user?.firstName || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profilePicture || user?.profileImageUrl} />
                <AvatarFallback className="text-xl">
                  {getInitials(user?.displayName || user?.firstName || user?.username || 'U')}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={user?.username || ''} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={isEditing ? editedProfile.displayName : (user?.displayName || '')}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                />
              </div>

              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={isEditing ? editedProfile.firstName : (user?.firstName || '')}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input 
                  value={user?.createdAt ? formatDate(user.createdAt) : 'Unknown'} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={updateProfileMutation.isPending}
                    className="flex-1"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Game Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Stats */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Overall Performance</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{(userStats as any)?.wins || 0}</div>
                  <div className="text-sm text-green-600">Wins</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{(userStats as any)?.losses || 0}</div>
                  <div className="text-sm text-red-600">Losses</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{(userStats as any)?.draws || 0}</div>
                  <div className="text-sm text-yellow-600">Draws</div>
                </div>
              </div>
            </div>

            {/* Online Game Stats */}
            {onlineStats && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <GamepadIcon className="w-5 h-5" />
                  Online Games
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{(onlineStats as any)?.totalGames || 0}</div>
                    <div className="text-sm text-blue-600">Total Games</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {(onlineStats as any)?.totalGames > 0 ? (((onlineStats as any).wins / (onlineStats as any).totalGames) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-purple-600">Win Rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2 mt-6">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => onNavigate('achievements')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Achievements
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => onNavigate('statistics')}
              >
                <GamepadIcon className="w-4 h-4 mr-2" />
                Detailed Statistics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}