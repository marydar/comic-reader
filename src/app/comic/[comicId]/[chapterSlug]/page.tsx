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
import TopBar from './top-bar'
import BottomBar from './bottom-bar'
import { FaCircleChevronUp } from 'react-icons/fa6'
import { cn } from "@/lib/utils";
import AutoScroll from './auto-scroll'
import { useCurrentUser } from '@/features/auth/api/use-current-user'
import  { useAddView } from '@/features/chapter/api/use-add-view'
import { useGetNumberOfChapters } from '@/features/comic/api/use-get-comic-numberOf-chapters'
import { useGetChapters } from '@/features/chapter/api/use-get-chapters'  
import ChapterListModal from './chapter-list-modal'
import { useIsLikedByUser } from '@/features/chapter/api/use-is-liked-by-user'
import { useToggleLike } from '@/features/chapter/api/use-toggle-like'




const ChapterPage = () => {
  const router = useRouter();
  const chapterSlug = useChapterSlug();
  const comicId = useComicId();
  const currentUser = useCurrentUser();
  const [prevStatus, setPrevStatus] = useState<string>("");
  const [nextChapterStatus, setNextChapterStatus] = useState<"Loading next chapter" | "No More Chapters" | "">("");
  const [showBar, setShowBar] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const {mutate:addView } = useAddView()
  const [viewAdded, setViewAdded] = useState(false)
  const [showChapterListModal, setShowChapterListModal] = useState(false)
  

  
    
  

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  // Always compute order safely (or undefined)
  const match = chapterSlug?.match(/^ch_(\d+)$/);
  const order = match ? parseInt(match[1], 10) : undefined;

  // Hooks are always called, even if order is undefined
  const chapter = useGetChapterByOrder({comicId, order});

  const {mutate:toggleLike, isPending:isPendingToggleLike} = useToggleLike()
  const {data:isLiked, isLoading:isLoadingIsLiked} = useIsLikedByUser({chapterId: chapter.data?._id})

  const { results, status, loadMore } = useGetChaptersImages({
    chapterId: chapter.data? chapter.data?._id : undefined,
  });
  const {data:chapterAdj} = useGetChapterAdjacent({comicId, order})
  const userId = currentUser?.data?._id
  const chapterId = chapter?.data?._id

  const handleToggleLike = async()=>{
    if(!currentUser.data) return
    if(!chapter.data) return
    console.log("toggle like")
    await toggleLike({chapterId: chapter.data._id},
      {
        onSuccess:()=>{
          console.log("success")
        },
        onError:()=>{
          console.log("error")
        },
        onSettled:()=>{
          console.log("settled")
        }
      }
    )
  }

  const addViewToChapter = async()=>{
    if(!currentUser.data) return
    if(!chapter.data) return
    console.log("add view")
    await addView({chapterId: chapter.data._id},
      {
        onSuccess:()=>{
          console.log("success")
        },
        onError:()=>{
          console.log("error")
        },
        onSettled:()=>{
          console.log("settled")
        }
      }
    )
  }
  useEffect(() => {
    console.log("want to add view", currentUser.data)
    if(chapterId && userId && !viewAdded){
      setViewAdded(true)
      addViewToChapter()
    }
  }, [chapterId,userId, viewAdded])
  useEffect(() => {
  if (!bottomSentinelRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      if (status === "CanLoadMore") {
        loadMore();
      } else if (status === "Exhausted" && chapterAdj?.next) {
        setNextChapterStatus("");
        handleNext();
      }
      else if(status === "Exhausted" && !chapterAdj?.next){
        setNextChapterStatus("No More Chapters");
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
        // handlePrev();
        // //scroll a little lower to avoid top sentinel
        // window.scrollBy(0, -100);
        
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
  const toggleShowBar = () => {
    console.log("toggleShowBar")
    setShowBar(!showBar);
  }
  const goToUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const handleNext = () => {
    if(!chapterAdj?.next) return <>no more chapters</>
    router.push(`/comic/${comicId}/ch_${chapterAdj?.next?.order}`)
  }
  const handlePrev = () => {
    console.log("handlePrev hwre")
    if(!chapterAdj?.prev) return <>nomore chapters</>
    router.push(`/comic/${comicId}/ch_${chapterAdj?.prev?.order}`)
  }
  const handleGoToComicPage = () => {
    router.push(`/comic/${comicId}`)
  }
  

  // if (!match) return <>Loading...</>;
  // if (!chapter.data) return <>2Loading...</>;
  return (
    <div onClick={toggleShowBar} className='flex flex-col w-full justify-center items-center relative'>
      {(!match || !chapter.data) &&(
        <div className='w-[800px] h-[100vh] bg-primary/40'/>
      )}
      {chapter.data &&(
        <>
        <ChapterListModal open={showChapterListModal} onOpenChange={setShowChapterListModal}/>
        <TopBar handleGoToComic={handleGoToComicPage} comicName={chapter.data?.comicName} chapterName={chapter.data?.title} thumnailUrl={chapter.data?.thumbnail}  showBar={showBar} isLiked={isLiked} toggleLike={handleToggleLike}/>
        <BottomBar handleNextChapter={handleNext} handlePrevChapter={handlePrev} showBar={showBar} setShowChapterListModal={setShowChapterListModal} isLiked={isLiked} toggleLike={handleToggleLike}/>
        <div onClick={goToUp} className={cn('fixed bottom-10 right-10  cursor-pointer hidden md:flex')}>
          <FaCircleChevronUp  className='text-bars-foreground text-4xl hover:scale-120 hover:text-foreground' />
        </div>
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
        <div className='text center text-primary/40 text-sm'>{nextChapterStatus}</div>

        </>
        
      )}
        {/* <div ref={topSentinelRef} className="" />  */}
            
            {/* <Button onClick={handleNext} disabled={!chapterAdj?.next || !chapterAdj} className='bg-primary text-white w-full'>Next</Button> */}
    </div>
  )
}


   


export default ChapterPage