// components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import {Navbar} from "./navbar";
import { useChapterSlug } from "@/hooks/use-chapter-params";
import { read } from "fs";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const readingPage = useChapterSlug()?.startsWith("ch_");
  const hideNavbar = pathname.startsWith("/auth") || readingPage;

  if (hideNavbar) return null;
  return <Navbar />;
  
}
