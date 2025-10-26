import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}

function formatMarkdown(text: string) {
  const lines = text.split('\n');
  let formatted = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle numbered lists (e.g., "1. ", "2. ")
    if (/^\d+\.\s/.test(line)) {
      line = line.replace(/^(\d+)\.\s/, '<strong>$1.</strong> ');
    }
    
    // Handle bullet points (lines starting with * or •)
    if (/^\s*[\*•]\s/.test(line)) {
      line = line.replace(/^(\s*)[\*•]\s/, '$1• ');
    }
    
    // Handle bold text (**text**)
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    formatted += line + '\n';
  }
  
  return formatted.trim();
}

export default function AskCoach() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Hello! I'm your personal financial coach. I'm here to help you with budgeting, saving strategies, understanding your spending habits, and achieving your financial goals. What would you like to know today?"
    }
  ]);

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
    if (!chatMessage.trim() || chatMutation.isPending) return;
    
    setChatHistory((prev) => [...prev, { role: 'user', message: chatMessage }]);
    chatMutation.mutate(chatMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I start saving money?",
    "What's the 50/30/20 budgeting rule?",
    "How do I reduce impulse buying?",
    "Tips for building an emergency fund?"
  ];

  const handleSuggestion = (question: string) => {
    setChatMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-12rem)] flex flex-col backdrop-blur-xl bg-card/40 border-border/50">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Financial Literacy Coach
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your personal AI assistant for financial advice and money management
            </p>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" data-testid="chat-messages">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${msg.role}-${index}`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div 
                        className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert prose-strong:font-bold prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.message) }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-secondary">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {chatHistory.length === 1 && (
            <CardContent className="border-t border-b bg-muted/20 py-4">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 justify-start"
                    onClick={() => handleSuggestion(question)}
                    data-testid={`button-suggestion-${index}`}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          )}

          <CardContent className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about money, budgeting, or saving..."
                disabled={chatMutation.isPending}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
