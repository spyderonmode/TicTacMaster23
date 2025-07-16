import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  Search, 
  MessageCircle, 
  GamepadIcon, 
  Trophy, 
  Clock,
  UserPlus,
  Ban,
  MoreVertical,
  Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OnlinePlayersSlideProps {
  onNavigate: (slideId: string) => void;
  onBack: () => void;
}

interface OnlineUser {
  userId: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  profileImageUrl?: string;
  roomId?: string;
  lastSeen: string;
  isInGame?: boolean;
}

export function OnlinePlayersSlide({ onNavigate, onBack }: OnlinePlayersSlideProps) {
  const { user } = useAuth();
  const { lastMessage, sendMessage } = useWebSocket();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  // Fetch online users
  const { data: onlineUsersData, refetch } = useQuery({
    queryKey: ['onlineUsers'],
    queryFn: () => apiRequest('GET', '/api/users/online'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update online users when data changes
  useEffect(() => {
    if (onlineUsersData && Array.isArray(onlineUsersData)) {
      setOnlineUsers(onlineUsersData);
    }
  }, [onlineUsersData]);

  // Handle WebSocket updates for online users
  useEffect(() => {
    if (lastMessage?.type === 'online_users_update') {
      refetch();
    } else if (lastMessage?.type === 'user_online' || lastMessage?.type === 'user_offline') {
      refetch();
    }
  }, [lastMessage, refetch]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ targetUserId, message }: { targetUserId: string; message: string }) => {
      return apiRequest('POST', '/api/chat/send', {
        targetUserId,
        message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      setChatMessage('');
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Join matchmaking mutation
  const joinMatchmakingMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/matchmaking/join'),
    onSuccess: () => {
      toast({
        title: "Matchmaking",
        description: "Looking for opponents...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join matchmaking",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = onlineUsers.filter(onlineUser => 
    onlineUser.userId !== (user?.userId || user?.id) && // Exclude current user
    (onlineUser.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     onlineUser.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (user: OnlineUser) => {
    if (user.isInGame) return 'bg-yellow-500';
    if (user.roomId) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = (user: OnlineUser) => {
    if (user.isInGame) return 'In Game';
    if (user.roomId) return 'In Room';
    return 'Online';
  };

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffMs = now.getTime() - seen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleSendMessage = () => {
    if (!selectedUser || !chatMessage.trim()) return;
    
    sendMessageMutation.mutate({
      targetUserId: selectedUser.userId,
      message: chatMessage.trim(),
    });
  };

  const handleInviteToGame = (targetUser: OnlineUser) => {
    // This would typically create a room and invite the user
    toast({
      title: "Game Invitation",
      description: `Game invitation feature coming soon for ${targetUser.displayName}`,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Online Players
        </h1>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredUsers.length}</div>
              <div className="text-sm text-gray-600">Players Online</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredUsers.filter(u => u.roomId && !u.isInGame).length}
              </div>
              <div className="text-sm text-gray-600">Available to Play</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredUsers.filter(u => u.isInGame).length}
              </div>
              <div className="text-sm text-gray-600">Currently Playing</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Quick Matchmaking */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => joinMatchmakingMutation.mutate()}
          disabled={joinMatchmakingMutation.isPending}
          className="whitespace-nowrap"
        >
          <GamepadIcon className="w-4 h-4 mr-2" />
          {joinMatchmakingMutation.isPending ? 'Searching...' : 'Quick Match'}
        </Button>
      </div>

      {/* Online Players List */}
      <Card>
        <CardHeader>
          <CardTitle>Players Online</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((onlineUser) => (
                <div 
                  key={onlineUser.userId} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={onlineUser.profilePicture || onlineUser.profileImageUrl} />
                        <AvatarFallback>
                          {getInitials(onlineUser.displayName || onlineUser.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(onlineUser)}`} />
                    </div>
                    
                    <div>
                      <div className="font-medium">
                        {onlineUser.displayName || onlineUser.username}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getStatusText(onlineUser)}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatLastSeen(onlineUser.lastSeen)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(onlineUser)}
                      disabled={sendMessageMutation.isPending}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleInviteToGame(onlineUser)}
                      disabled={onlineUser.isInGame}
                    >
                      <GamepadIcon className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Trophy className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Friend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="w-4 h-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No players found' : 'No players online'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Be the first to start playing!'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => onNavigate('game-mode')}>
                  Start Playing
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message to {selectedUser.displayName || selectedUser.username}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none h-24 bg-background"
                maxLength={500}
              />
              <div className="text-sm text-gray-500 text-right">
                {chatMessage.length}/500
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedUser(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || sendMessageMutation.isPending}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}