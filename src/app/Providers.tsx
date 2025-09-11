"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";
import NavbarWrapper from "@/components/navbar-wrapper";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ConvexClientProvider>
      <NavbarWrapper />
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ConvexClientProvider>
  );
}
