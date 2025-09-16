"use client"
import React, { use } from 'react'
import { useChapterSlug } from '@/hooks/use-chapter-params'
import { useComicId } from '@/hooks/use-comic-id'
import { useGetChapterByOrder } from '@/features/chapter/api/use-get-chapter-byOrder'
import { notFound } from 'next/navigation'
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Id } from '../../../../../convex/_generated/dataModel'
import { Loader } from 'lucide-react'
import { stat } from 'fs'


// const ChapterPage = () => {
//     const chapterSlug = useChapterSlug()
//     const comicId = useComicId()
//     const match = chapterSlug.match(/^ch_(\d+)$/);
//   if (!match) return notFound();
//   const order = parseInt(match[1], 10);
//   // Fetch chapter by comicId + order
//   const chapter =  useGetChapterByOrder({comicId, order});
//   if (!chapter) return notFound();
//   return (
//     <div>
//         {chapter.data?.title}
//     </div>
//   )
// }


   function ChapterPage() {
  const { comicId, chapterSlug } = useParams() as { comicId: Id<"comics">; chapterSlug: string };
  const router = useRouter();
  const currentOrder = parseInt(chapterSlug.replace("ch_", ""), 10);
  const [activeOrder, setActiveOrder] = useState(currentOrder);

  const [bottomEl, setBottomEl] = useState<HTMLDivElement | null>(null);
  const [topEl, setTopEl] = useState<HTMLDivElement | null>(null);


  const [chaptersStack, setChaptersStack] = useState<
    { id: Id<"chapters">; order: number; images: any[]; nextCursor?: string }[]
  >([]);

  /** Load chapter meta whenever order changes */
  const { data: currentChapter, isLoading } = useGetChapterByOrder({comicId, order: currentOrder});
  // Initial load
  useEffect(() => {
    // console.log("effect" , currentChapter)
    if (currentChapter && !chaptersStack.find((c) => c.id === currentChapter._id)) {
      // console.log("effect2" , chaptersStack)
      setChaptersStack(prev => [
      ...prev,
      { id: currentChapter._id, order: currentOrder, images: [] },
      ]);
      setActiveOrder(currentOrder);
    }
    console.log("first thing ",chaptersStack)
  }, [currentChapter, currentOrder]);

  

  /** Intersection observers */
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { next: nextChapter, prev: prevChapter } =
    useQuery(api.chapter.adjacent, { comicId, order: currentOrder }) ?? {};

  // Bottom infinite scroll → load next chapter
  // useEffect(() => {
  //   if (!bottomRef.current || !nextChapter) return;
  //   const obs = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         console.log("bottom ons")
  //         router.replace(`/comic/${comicId}/ch_${nextChapter.order}`);
  //         setChaptersStack(old => [
  //       ...old,
  //       { id: nextChapter._id, order: nextChapter.order, images: [] },
  //       ]);
  //         console.log("bottom", chaptersStack)
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );
  //   obs.observe(bottomRef.current);
  //   return () => obs.disconnect();
  // }, [bottomRef, nextChapter]);

  useEffect(() => {
  if (!bottomEl || !nextChapter) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && nextChapter && activeOrder !== nextChapter.order) {
    setActiveOrder(nextChapter.order);
    router.replace(`/comic/${comicId}/ch_${nextChapter.order}`);
    setChaptersStack(old => [
      ...old,
      { id: nextChapter._id, order: nextChapter.order, images: [] },
    ]);
  }
  }, { threshold: 0.5 });

  obs.observe(bottomEl);
  return () => obs.disconnect();
}, [bottomEl, nextChapter, comicId, router, setChaptersStack]);

  // Top scroll → load previous chapter
  // useEffect(() => {
  //   if (!topRef.current || !prevChapter) return;
  //   const obs = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         setChaptersStack((old) => [
  //           { id: prevChapter._id, order: prevChapter.order, images: [] },
  //           ...old,
  //         ]);
  //         router.replace(`/comic/${comicId}/ch_${prevChapter.order}`);
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );
  //   obs.observe(topRef.current);
  //   return () => obs.disconnect();
  // }, [topRef, prevChapter]);

  


    if(isLoading){
      return <div>Loading...</div>
    }

  return (
  <>
  {!currentChapter && (
    <div>Loading...</div>
  )}
  {currentChapter &&  chaptersStack.length > 0 && (
    <div className="flex flex-col items-center">
        <ChapterImages chapterId={currentChapter._id} />
       {/* <div ref={setTopEl} /> */}
       {/* {chaptersStack.map((chapter, i) => (
        <ChapterImages
          key={chapter.id}
          chapterId={chapter.id}
          isLast={i === chaptersStack.length - 1}
          onReachEnd={() => {
            if (nextChapter && activeOrder !== nextChapter.order) {
              setActiveOrder(nextChapter.order);
              router.replace(`/comic/${comicId}/ch_${nextChapter.order}`);
              setChaptersStack(old => [...old, { id: nextChapter._id, order: nextChapter.order, images: [] }]);
            }
          }}
        />
      ))} */}
      {/* <div ref={setBottomEl} />hello */}
    </div>
  )}
  </>
    
  );
}

function ChapterImages({ chapterId}: { chapterId: Id<"chapters">; }) {
  // const sentinelRef = useRef<HTMLDivElement>(null);
  const { results, loadMore, status } = usePaginatedQuery(
    api.chapterImage.listPaginated,
    { chapterId, pageSize: 2 },
    { initialNumItems: 1 }
  );

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && status === "CanLoadMore") {
          loadMore(1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(el);
    return () => observer.disconnect();   // ✅ proper cleanup
  }, [status, loadMore]);
  

  return (
    <>
    <div>
      {results.map((img) => (
        // <p>{img.imageUrl}</p>
        <img key={img._id} src={img.imageUrl ? img.imageUrl : "https://via.placeholder.com/150"} alt="" className='h-full w-[800px] ' />
      ))}
    </div>
    <div className="h-1" ref={loadMoreRef} />
            {status === "LoadingMore" && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gary-300 shadow-sm">
                        <Loader className="size-4 animate-spin"/>
                    </span>
                </div>
            )}
    </>
  );
}


export default ChapterPage