import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LogOut, MessageCircle, Send } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; message: string }>>([]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/ai/chat", "POST", { message });
      return response.json();
    },
    onSuccess: (data: any) => {
      setChatHistory((prev) => [...prev, { role: 'assistant', message: data.response }]);
      setChatMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory((prev) => [...prev, { role: 'user', message: chatMessage }]);
    chatMutation.mutate(chatMessage);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Profile</h1>
        <p className="text-muted-foreground">Your account and AI assistant</p>
      </div>

      <Card data-testid="card-user-info">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold" data-testid="text-user-name">
                {user?.firstName || user?.email || "User"}
              </h2>
              <p className="text-muted-foreground" data-testid="text-user-email">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>

      <Card data-testid="card-ai-assistant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Financial Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about personal finance!</p>
                  <p className="text-sm mt-2">Try: "How can I save more money?" or "What's a good emergency fund?"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      data-testid={`chat-message-${index}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          chat.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about budgeting, saving, or investments..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={chatMutation.isPending || !chatMessage.trim()}
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {!process.env.GEMINI_API_KEY && (
              <p className="text-xs text-muted-foreground text-center">
                Note: AI assistant requires Gemini API key to be configured
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Onboarding Status</h3>
            <p className="text-sm text-muted-foreground">
              {user?.onboardingStatus === 'completed' ? 'Completed' : `Step ${user?.onboardingStatus?.replace('step_', '') || '1'}`}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">KYC Status</h3>
            <p className="text-sm text-muted-foreground">
              {user?.kycCompleted ? 'Verified' : 'Pending'}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Account Aggregator</h3>
            <p className="text-sm text-muted-foreground">
              {user?.aaToken ? 'Connected' : 'Not Connected'}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">UPI Mandate</h3>
            <p className="text-sm text-muted-foreground">
              {user?.mandateId ? 'Approved' : 'Not Set Up'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
