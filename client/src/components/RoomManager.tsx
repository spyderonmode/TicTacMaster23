import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Plus, LogOut, Play } from "lucide-react";

interface RoomManagerProps {
  currentRoom: any;
  onRoomJoin: (room: any) => void;
  onRoomLeave: () => void;
  onCreateRoom: () => void;
  onGameStart: (game: any) => void;
  gameMode: 'ai' | 'pass-play' | 'online';
  user: any;
}

export function RoomManager({ 
  currentRoom, 
  onRoomJoin, 
  onRoomLeave, 
  onCreateRoom, 
  onGameStart,
  gameMode,
  user 
}: RoomManagerProps) {
  const [joinCode, setJoinCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinRoomMutation = useMutation({
    mutationFn: async (data: { code: string }) => {
      const response = await apiRequest('POST', `/api/rooms/${data.code}/join`, { role: 'player' });
      return response.json();
    },
    onSuccess: (data) => {
      onRoomJoin(data.room);
      setJoinCode("");
      toast({
        title: "Success",
        description: "Joined room successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startGameMutation = useMutation({
    mutationFn: async () => {
      if (!currentRoom) throw new Error('No room selected');
      
      const gamePayload: any = {
        roomId: currentRoom.id,
        gameMode: gameMode,
      };
      
      // Only include playerOId if it's not null/undefined
      if (gameMode === 'ai') {
        gamePayload.playerOId = 'AI';
      }
      
      const response = await apiRequest('POST', '/api/games', gamePayload);
      return response.json();
    },
    onSuccess: (game) => {
      console.log('🎮 Game started successfully:', game);
      onGameStart(game);
      toast({
        title: "Game Started",
        description: "Let the battle begin!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      joinRoomMutation.mutate({ 
        code: joinCode.trim().toUpperCase()
      });
    }
  };

  const handleLeaveRoom = () => {
    onRoomLeave();
    toast({
      title: "Left Room",
      description: "You have left the room",
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Room Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentRoom ? (
          <>
            {/* Join Room */}
            <div className="space-y-2">
              <Input
                placeholder="Room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="bg-slate-700 border-slate-600 text-white"
                maxLength={8}
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleJoinRoom}
                  disabled={!joinCode.trim() || joinRoomMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Join Room
                </Button>
              </div>
            </div>
            
            {/* Create Room */}
            <Button 
              onClick={onCreateRoom}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={joinRoomMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Room
            </Button>
          </>
        ) : (
          <>
            {/* Current Room */}
            <div className="p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Current Room</span>
                <Badge variant="secondary" className="bg-green-600">
                  ACTIVE
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Room #{currentRoom.code}
              </div>
              <div className="text-sm text-gray-400">
                {currentRoom.name}
              </div>
            </div>

            {/* Room Actions */}
            <div className="flex space-x-2">
              {/* Check if user is room owner */}
              {currentRoom.ownerId === (user?.userId || user?.id) ? (
                <Button
                  onClick={() => {
                    console.log('🎮 Start game button clicked');
                    startGameMutation.mutate();
                  }}
                  disabled={startGameMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {startGameMutation.isPending ? 'Starting...' : 'Start Game'}
                </Button>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gray-600 cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Wait for Start
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLeaveRoom}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
