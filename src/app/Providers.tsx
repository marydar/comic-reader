"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ConvexClientProvider } from "./ConvexClientProvider";
import NavbarWrapper from "@/components/navbar-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ConvexClientProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavbarWrapper />
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ConvexClientProvider>
  );
}
