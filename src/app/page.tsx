"use client"
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.replace("/home")
  return (
    <>
    <div>
      hello0000
    </div>
    {/* <div className="bg-amber-100">hello </div> */}
    </>
  );
}
