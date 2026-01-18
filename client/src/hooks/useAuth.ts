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
      const response = await fetch("/api/auth/user", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    }
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
