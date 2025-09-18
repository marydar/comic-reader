"use client"
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import HeroSkeleton from "./home/hero-skeleton";
import ComicGridRowSkeleton from "@/features/comic/components/comic-grid-row-skeleton";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home")
  }, [router])
  return (
    <>
    <div>
     <HeroSkeleton />
     <div className="flex flex-col gap-4 mt-10 justify-center items-center">
      <ComicGridRowSkeleton />
      <ComicGridRowSkeleton />
     </div>
    </div>
    {/* <div className="bg-amber-100">hello </div> */}
    </>
  );
}
