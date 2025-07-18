import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Eye } from "lucide-react";

interface PlayerListProps {
  roomId: string;
}

export function PlayerList({ roomId }: PlayerListProps) {
  const { data: participantsData = [], isLoading } = useQuery({
    queryKey: ["/api/rooms", roomId, "participants"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/participants`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error('Failed to fetch participants');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Failed to fetch participants:', error);
        return [];
      }
    },
    enabled: !!roomId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const participants = participantsData || [];

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Players & Spectators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-slate-700 rounded mb-2"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const players = participants.filter((p: any) => p.role === 'player');
  const spectators = participants.filter((p: any) => p.role === 'spectator');

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Players & Spectators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Players */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Players ({players.length}/2)
          </h4>
          <div className="space-y-2">
            {players.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                No players in room
              </div>
            ) : (
              players.map((participant, index) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                  <div className="flex items-center space-x-3">
                    {participant.user.profileImageUrl ? (
                      <img 
                        src={participant.user.profileImageUrl} 
                        alt="Player Avatar" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm">
                      {participant.user.firstName || participant.user.username || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-gray-400">
                      {index === 0 ? 'X' : 'O'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Spectators */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Spectators ({spectators.length})
          </h4>
          <div className="space-y-2">
            {spectators.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No spectators
              </div>
            ) : (
              spectators.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                  <div className="flex items-center space-x-3">
                    {participant.user.profileImageUrl ? (
                      <img 
                        src={participant.user.profileImageUrl} 
                        alt="Spectator Avatar" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm">
                      {participant.user.firstName || participant.user.username || 'Anonymous'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-gray-600 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    WATCHING
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
