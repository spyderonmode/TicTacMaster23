import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  chatPartner: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  user: any;
}

export function ChatPopup({ isOpen, onClose, chatPartner, messages, onSendMessage, user }: ChatPopupProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatPartner) return;

    try {
      await apiRequest('POST', '/api/chat/send', {
        targetUserId: chatPartner.id,
        message: newMessage.trim()
      });
      
      onSendMessage(newMessage.trim());
      setNewMessage('');
      
      toast({
        title: "Message Sent",
        description: `Message sent to ${chatPartner.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !chatPartner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-4 right-4 z-50 w-80 max-w-[90vw]"
      >
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="truncate">Chat with {chatPartner.name}</span>
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-3 pt-0">
              {/* Messages Area */}
              <ScrollArea className="h-48 mb-3 p-2 bg-slate-900 rounded border border-slate-600">
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs py-4">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.senderId === user?.userId || msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-xs ${
                            msg.senderId === user?.userId || msg.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          <div className="break-words">{msg.message}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 h-8 text-xs bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}