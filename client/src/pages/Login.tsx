import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Use the full URL in production, local URL in development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://pocket-fund-theta.vercel.app' 
      : 'http://localhost:5000';
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 p-8 rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-6">Welcome to Pocket Fund</h1>
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            "Sign in with Google"
          )}
        </Button>
      </div>
    </div>
  );
}