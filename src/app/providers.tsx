"use client";

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux"
import { makeStore } from "@/lib/store"
import { AuthProvider } from "@/contexts/AuthContext"
import { useState, useRef } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));
  const storeRef = useRef<ReturnType<typeof makeStore>>();
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={storeRef.current}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  )
}

export default Providers
