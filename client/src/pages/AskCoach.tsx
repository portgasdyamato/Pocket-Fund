import { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
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

  // Voice Interaction State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mutedMessages, setMutedMessages] = useState<Set<number>>(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Handle Voice Input
  useEffect(() => {
    if (transcript) {
      setChatMessage(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    try {
      if (listening) {
        console.log("Stopping listening...");
        SpeechRecognition.stopListening();
      } else {
        console.log("Starting listening...");
        resetTranscript();
        SpeechRecognition.startListening({ 
          continuous: true,
          language: 'en-IN' // Adding support for Indian English as per the app's context
        });
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Handle Output (Text-to-Speech)
  const speak = (text: string, messageIndex?: number) => {
    if (isMuted || !window.speechSynthesis) return;
    if (messageIndex !== undefined && mutedMessages.has(messageIndex)) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    setCurrentlyPlaying(null);

    // Strip Markdown for speech
    const cleanText = text.replace(/[*#_`]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageIndex !== undefined) setCurrentlyPlaying(messageIndex);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle per-message voice control
  const handleMessageVoiceClick = (messageIndex: number, messageText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Double-click to toggle mute
    if (e.detail === 2) {
      setMutedMessages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(messageIndex)) {
          newSet.delete(messageIndex);
        } else {
          newSet.add(messageIndex);
          // Stop if currently playing this message
          if (currentlyPlaying === messageIndex) {
            window.speechSynthesis.cancel();
            setCurrentlyPlaying(null);
            setIsSpeaking(false);
          }
        }
        return newSet;
      });
      return;
    }

    // Single click to play/pause
    if (currentlyPlaying === messageIndex) {
      // Pause if playing
      window.speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      setIsSpeaking(false);
    } else {
      // Play if not playing
      speak(messageText, messageIndex);
    }
  };

  const toggleMute = () => {
    window.speechSynthesis.cancel();
    setIsMuted(!isMuted);
    setIsSpeaking(false);
  };

  // Stop listening when sending message manually
  useEffect(() => {
    if (!listening && transcript) {
      // Optional: Auto-send could go here, but manual is safer for edits
    }
  }, [listening, transcript]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/ai/chat", "POST", { message });
      return response.json();
    },
    onSuccess: (data: any) => {
      const newIndex = chatHistory.length; // Index of the new message
      setChatHistory((prev) => [...prev, { role: 'assistant', message: data.response }]);
      setChatMessage("");
      resetTranscript();
      // Auto-play the new message (will respect global mute and per-message mute)
      setTimeout(() => {
        speak(data.response, newIndex);
      }, 100);
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header - Below Main Navbar */}
      <div className="sticky top-[64px] z-40 border-b border-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  Financial Literacy Coach
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your personal AI assistant for financial advice and money management
                </p>
              </div>
            </div>
            
            {/* Voice Control */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost" 
                size="sm"
                onClick={toggleMute}
                className={`${isSpeaking ? "text-primary animate-pulse" : ""} hover:bg-muted/50`}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="ml-2 text-xs hidden lg:inline">
                  {isMuted ? "Voice Off" : (isSpeaking ? "Speaking..." : "Voice On")}
                </span>
              </Button>
              
              {browserSupportsSpeechRecognition && (
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${listening ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                  <span>{listening ? "Listening..." : "Ready"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area - Full Height */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 w-full px-6 py-6">
            <div className="space-y-6 max-w-5xl mx-auto" data-testid="chat-messages">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}
                  data-testid={`message-${msg.role}-${index}`}
                >
                  {msg.role === 'assistant' && (
                    <>
                      <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary border-0">
                          <Sparkles className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      {/* Per-message voice control button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleMessageVoiceClick(index, msg.message, e)}
                        className={`w-8 h-8 flex-shrink-0 rounded-lg hover:bg-muted/50 transition-all ${
                          mutedMessages.has(index) 
                            ? 'text-muted-foreground opacity-50' 
                            : currentlyPlaying === index 
                            ? 'text-primary animate-pulse' 
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                        title={mutedMessages.has(index) 
                          ? 'Unmute this message (double-click)' 
                          : currentlyPlaying === index 
                          ? 'Click to stop, double-click to mute' 
                          : 'Click to play, double-click to mute'}
                      >
                        {mutedMessages.has(index) ? (
                          <VolumeX className="w-4 h-4" />
                        ) : currentlyPlaying === index ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  
                  <div
                    className={`max-w-[75%] md:max-w-[70%] rounded-2xl p-5 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md'
                        : 'bg-card/80 backdrop-blur-sm border border-border/50 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="text-sm md:text-base prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-h1:text-xl prose-h1:mt-3 prose-h1:mb-3 prose-h2:text-lg prose-h2:mt-3 prose-h2:mb-2 prose-h3:text-base prose-h3:mt-2 prose-h3:mb-2 prose-p:my-2 prose-p:leading-relaxed prose-strong:font-bold prose-strong:text-foreground prose-ul:my-3 prose-ol:my-3 prose-li:my-2 prose-li:leading-relaxed prose-code:text-xs prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-pre:bg-muted/50 prose-pre:p-3 prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-3">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-semibold mt-3 mb-3 text-foreground" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-3 mb-2 text-foreground" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-2 mb-2 text-foreground" {...props} />,
                            p: ({node, ...props}) => <p className="my-2 leading-relaxed text-foreground" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside my-3 space-y-2 ml-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside my-3 space-y-2 ml-2" {...props} />,
                            li: ({node, ...props}) => <li className="my-2 leading-relaxed text-foreground" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline ? (
                                <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded font-mono text-primary" {...props} />
                              ) : (
                                <code className="block text-xs bg-muted/50 p-3 rounded-lg font-mono overflow-x-auto border border-border" {...props} />
                              ),
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground" {...props} />,
                          }}
                        >
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-secondary/20">
                      <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary border-0">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-4 justify-start items-start">
                  <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary border-0">
                      <Sparkles className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-md p-5 shadow-md">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Suggested Questions - Only show when chat is empty */}
        {chatHistory.length === 1 && (
          <div className="border-t border-border/50 bg-card/40 backdrop-blur-xl px-6 py-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Suggested questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-sm h-auto py-3 px-4 justify-start text-left hover:bg-primary/10 hover:border-primary/50 transition-all rounded-xl"
                  onClick={() => handleSuggestion(question)}
                  data-testid={`button-suggestion-${index}`}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Premium Input Bar */}
        <div className="sticky bottom-0 border-t border-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 shadow-lg">
          <div className="flex gap-3 max-w-5xl mx-auto">
            <Button
              variant={listening ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleListening}
              className={`flex-shrink-0 w-11 h-11 rounded-xl ${listening ? "animate-pulse shadow-lg shadow-destructive/20" : "hover:bg-muted/50"} transition-all`}
              title={listening ? "Stop Listening" : "Start Listening"}
              disabled={!browserSupportsSpeechRecognition}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Input
              value={chatMessage}
              onChange={(e) => {
                 setChatMessage(e.target.value);
                 if(listening) resetTranscript();
              }}
              onKeyPress={handleKeyPress}
              placeholder={listening ? "Listening..." : "Ask anything about money, budgeting, or saving..."}
              disabled={chatMutation.isPending}
              className="flex-1 h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
              data-testid="input-chat-message"
            />
            <Button
              onClick={() => {
                SpeechRecognition.stopListening();
                handleSendMessage();
              }}
              disabled={!chatMessage.trim() || chatMutation.isPending}
              size="icon"
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
    </div>
  );
}
