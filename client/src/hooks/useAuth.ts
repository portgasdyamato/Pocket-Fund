import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0,
    gcTime: 0, // Ensure no old auth data persists
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    queryFn: async () => {
      console.log("[Auth] Checking authentication status...");
      const response = await fetch("/api/auth/user", {
        credentials: "include"
      });
      
      if (response.status === 401) {
        console.warn("[Auth] User is not authenticated (401)");
        return null;
      }
      
      if (!response.ok) {
        console.error(`[Auth] Error fetching user: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch user");
      }
      
      const userData = await response.json();
      console.log("[Auth] Successfully authenticated as:", userData.email);
      return userData;
    }
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
