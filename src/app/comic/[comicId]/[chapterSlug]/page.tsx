"use client"
import React, { use } from 'react'
import { useChapterSlug } from '@/hooks/use-chapter-params'
import { useComicId } from '@/hooks/use-comic-id'
import { useGetChapterByOrder } from '@/features/chapter/api/use-get-chapter-byOrder'
import { notFound } from 'next/navigation'
import { useGetChaptersImages } from '@/features/chapter/api/use-get-chapters-images'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useGetChapterAdjacent } from '@/features/chapter/api/use-get-chapter-adjacent'
import { useRef, useEffect, useState } from 'react'
import { stat } from 'fs'



const ChapterPage = () => {
  const router = useRouter();
    const chapterSlug = useChapterSlug();
  const comicId = useComicId();
  const [prevStatus, setPrevStatus] = useState<string>("");

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  // Always compute order safely (or undefined)
  const match = chapterSlug?.match(/^ch_(\d+)$/);
  const order = match ? parseInt(match[1], 10) : undefined;

  // Hooks are always called, even if order is undefined
  const chapter = useGetChapterByOrder({comicId, order});

  const { results, status, loadMore } = useGetChaptersImages({
    chapterId: chapter.data? chapter.data?._id : undefined,
  });
  const {data:chapterAdj} = useGetChapterAdjacent({comicId, order})
  useEffect(() => {
  if (!bottomSentinelRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      if (status === "CanLoadMore") {
        loadMore();
      } else if (status === "Exhausted" && chapterAdj?.next) {
        handleNext();
      }
    },
    { threshold: 1 }
  );

  observer.observe(bottomSentinelRef.current);
  return () => observer.disconnect();
}, [status, chapterAdj]);
useEffect(() => {
  if (!topSentinelRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      console.log("top sentinel", status, prevStatus, chapterAdj?.prev)
      // ✅ Only go to prev chapter if fully loaded or exhausted
      if (chapterAdj?.prev && status === "LoadingFirstPage") {
        setPrevStatus("LoadingFirstPage");
      }
      // else if (chapterAdj?.prev && prevStatus === "LoadingFirstPage") {
      //   setPrevStatus(status);
      // }
      if (chapterAdj?.prev && status !== "LoadingMore" && prevStatus === "LoadingFirstPage") {
        handlePrev();
      }
      // if (chapterAdj?.prev && status === "Exhausted" && prevStatus === "LoadingFirstPage") {
      //   handlePrev();
      // }
      
    },
    { threshold: 1 } // fully visible
  );

  observer.observe(topSentinelRef.current);
  return () => observer.disconnect();
}, [status, chapterAdj]);


  const handleNext = () => {
    if(!chapterAdj?.next) return <>nomore chapters</>
    router.push(`/comic/${comicId}/ch_${chapterAdj?.next?.order}`)
  }
  const handlePrev = () => {
    console.log("handlePrev hwre")
    if(!chapterAdj?.prev) return <>nomore chapters</>
    router.push(`/comic/${comicId}/ch_${chapterAdj?.prev?.order}`)
  }

  if (!match) return <>Loading...</>;
  if (!chapter.data) return <>2Loading...</>;
  return (
    <div className='flex flex-col gap-2 w-full justify-center items-center'>
      {chapter.data?.title}
        <div ref={topSentinelRef} className="h-1" /> 
        {results.map((img) => (
          <img key={img._id} src={img.imgUrl ? img.imgUrl : "https://via.placeholder.com/150"} alt="" className='h-full w-[800px] ' />
        ))}
        <div ref={bottomSentinelRef} className="h-1" />
            {status === "LoadingMore" && (  
              <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gary-300 shadow-sm">
                        <Loader className="size-4 animate-spin"/>
                    </span>
                </div>
            )}
            <Button onClick={handleNext} disabled={!chapterAdj?.next || !chapterAdj} className='bg-primary text-white w-full'>Next</Button>
    </div>
  )
}


   


export default ChapterPage