import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TopNavigation } from "@/components/layout/top-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: api.getCurrentUser,
  });

  // Mock conversations data - in a real app this would come from the API
  const mockConversations = [
    {
      id: 1,
      user1: { id: 1, name: "Ahmet Yılmaz", username: "ahmet_yilmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" },
      user2: { id: 3, name: "Barış Özkan", username: "baris_ozkan", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150" },
      lastMessage: { content: "React projesi nasıl gidiyor?", createdAt: new Date(Date.now() - 300000) },
      unreadCount: 2,
      lastMessageAt: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      user1: { id: 1, name: "Ahmet Yılmaz", username: "ahmet_yilmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" },
      user2: { id: 4, name: "Selin Çelik", username: "selin_celik", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150" },
      lastMessage: { content: "Fotoğraflar harika görünüyor!", createdAt: new Date(Date.now() - 3600000) },
      unreadCount: 0,
      lastMessageAt: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      user1: { id: 1, name: "Ahmet Yılmaz", username: "ahmet_yilmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" },
      user2: { id: 2, name: "Elif Demir", username: "elif_demir", avatar: "https://pixabay.com/get/g262776e4eee2a40b4e3ed1491282caaee776302356458ece6667e4bbce6b76c2858adfd065ef2ddb1a5a1140d1d4dfc1c5b30f3a2a01bdaccc77606113e60922_1280.jpg" },
      lastMessage: { content: "Tasarım toplantısı için teşekkürler", createdAt: new Date(Date.now() - 7200000) },
      unreadCount: 1,
      lastMessageAt: new Date(Date.now() - 7200000)
    }
  ];

  // Mock messages for selected conversation
  const getMockMessages = (conversationId: number) => {
    const messagesSets = {
      1: [
        { id: 1, senderId: 3, content: "Merhaba! Nasılsın?", createdAt: new Date(Date.now() - 7200000), sender: { name: "Barış Özkan", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150" } },
        { id: 2, senderId: 1, content: "İyiyim, teşekkürler! Sen nasılsın?", createdAt: new Date(Date.now() - 7000000), sender: { name: "Ahmet Yılmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" } },
        { id: 3, senderId: 3, content: "React projesi nasıl gidiyor?", createdAt: new Date(Date.now() - 300000), sender: { name: "Barış Özkan", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150" } },
        { id: 4, senderId: 1, content: "Çok iyi! Yeni özellikler ekliyorum.", createdAt: new Date(Date.now() - 60000), sender: { name: "Ahmet Yılmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" } }
      ],
      2: [
        { id: 5, senderId: 4, content: "Fotoğraflar harika görünüyor!", createdAt: new Date(Date.now() - 3600000), sender: { name: "Selin Çelik", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150" } },
        { id: 6, senderId: 1, content: "Teşekkürler! Çok emek verdim.", createdAt: new Date(Date.now() - 3300000), sender: { name: "Ahmet Yılmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" } }
      ],
      3: [
        { id: 7, senderId: 2, content: "Tasarım toplantısı için teşekkürler", createdAt: new Date(Date.now() - 7200000), sender: { name: "Elif Demir", avatar: "https://pixabay.com/get/g262776e4eee2a40b4e3ed1491282caaee776302356458ece6667e4bbce6b76c2858adfd065ef2ddb1a5a1140d1d4dfc1c5b30f3a2a01bdaccc77606113e60922_1280.jpg" } },
        { id: 8, senderId: 1, content: "Rica ederim! Çok verimli geçti.", createdAt: new Date(Date.now() - 7000000), sender: { name: "Ahmet Yılmaz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" } }
      ]
    };
    return messagesSets[conversationId] || [];
  };

  const selectedConversationData = mockConversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? getMockMessages(selectedConversation) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // In a real app, this would be an API call
    console.log("Sending message:", messageText, "to conversation:", selectedConversation);
    setMessageText("");
  };

  const filteredConversations = mockConversations.filter(conversation => {
    const otherUser = conversation.user1.id === currentUser?.id ? conversation.user2 : conversation.user1;
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mesajlar</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Sohbet ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="p-2">
                  {filteredConversations.map((conversation) => {
                    const otherUser = conversation.user1.id === currentUser?.id ? conversation.user2 : conversation.user1;
                    const isSelected = selectedConversation === conversation.id;
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="flex-1 ml-3 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{otherUser.name}</h3>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true, locale: tr })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0 h-full flex flex-col">
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={(selectedConversationData.user1.id === currentUser?.id ? selectedConversationData.user2 : selectedConversationData.user1).avatar}
                        alt={(selectedConversationData.user1.id === currentUser?.id ? selectedConversationData.user2 : selectedConversationData.user1).name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">
                          {(selectedConversationData.user1.id === currentUser?.id ? selectedConversationData.user2 : selectedConversationData.user1).name}
                        </h3>
                        <p className="text-sm text-green-600">Çevrimiçi</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwn = message.senderId === currentUser?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex items-end space-x-2 ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            {!isOwn && (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isOwn
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                                {formatDistanceToNow(message.createdAt, { addSuffix: true, locale: tr })}
                              </p>
                            </div>
                            
                            {isOwn && (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bir sohbet seçin</h3>
                    <p className="text-gray-600">Mesajlaşmaya başlamak için soldaki listeden bir sohbet seçin.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}