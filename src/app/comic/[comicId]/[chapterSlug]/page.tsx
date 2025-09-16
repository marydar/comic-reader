"use client"
import React, { use } from 'react'
import { useChapterSlug } from '@/hooks/use-chapter-params'
import { useComicId } from '@/hooks/use-comic-id'
import { useGetChapterByOrder } from '@/features/chapter/api/use-get-chapter-byOrder'
import { notFound } from 'next/navigation'
import { useGetChaptersImages } from '@/features/chapter/api/use-get-chapters-images'
import { Loader } from 'lucide-react'



const ChapterPage = () => {
    const chapterSlug = useChapterSlug();
  const comicId = useComicId();

  // Always compute order safely (or undefined)
  const match = chapterSlug?.match(/^ch_(\d+)$/);
  const order = match ? parseInt(match[1], 10) : undefined;

  // Hooks are always called, even if order is undefined
  const chapter = useGetChapterByOrder({comicId, order});

  const { results, status, loadMore } = useGetChaptersImages({
    chapterId: chapter.data? chapter.data?._id : undefined,
  });

  if (!match) return <>Loading...</>;
  if (!chapter.data) return <>2Loading...</>;
  return (
    <div>
        {chapter.data?.title}
        {results.map((img) => (
            <img key={img._id} src={img.imgUrl ? img.imgUrl : "https://via.placeholder.com/150"} alt="" className='h-full w-[800px] ' />
        ))}
        <div
                className="h-1"
                ref={(el) =>{
                    if(el){
                        const observer = new IntersectionObserver(
                            ([entry])=>{
                                if(entry.isIntersecting && status === "CanLoadMore"){
                                    loadMore()
                                }
                            },
                            {threshold: 1.0}
                        )
                        observer.observe(el)
                        return () => {observer.disconnect()}
                    }
                }}
            />
            {status === "LoadingMore" && (  
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300"/>
                    <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gary-300 shadow-sm">
                        <Loader className="size-4 animate-spin"/>
                    </span>
                </div>
            )}
    </div>
  )
}


   


export default ChapterPage