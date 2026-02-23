import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: 3,                    // Retry up to 3 times — handles post-OAuth session race condition
    retryDelay: 500,             // Wait 500ms between retries
    staleTime: 30_000,           // Cache for 30s to avoid hammering the server
    gcTime: 0,                   // Don't persist old auth data after GC
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include"
      });
      
      if (response.status === 401) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Auth check failed: ${response.status}`);
      }
      
      return await response.json();
    }
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
