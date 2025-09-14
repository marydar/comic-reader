"use client"
import React from 'react'
import UploadCard from '@/components/uploadCard'
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import GenreSelector from '@/components/genre-selector'
import { Button } from '@/components/ui/button'
import { TriangleAlert, Upload } from 'lucide-react'
import getUploadImageId from '@/components/upload-image'
import { useCreateComic } from '@/features/comic/api/use-create-comic'
import { toast } from 'sonner'
import { genreEnum } from "../../../../../convex/genres";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useGenerateUploadUrl } from "@/features/upload-image-url";
import { Id } from "../../../../../convex/_generated/dataModel";
import UploadMultipleCard from '@/components/uploadMultipleCard'
import { useComicId } from '@/hooks/use-comic-id'
import { useCreateChapter } from '@/features/chapter/api/use-create-chapter'
import { useCreateChapterImage } from '@/features/chapter/api/use-create-chapterImage'
import { useGetComicById } from '@/features/comic/api/use-get-comic-by-id'
import { cn } from '@/lib/utils'


const PublishChapterPage = () => {
  const comicId = useComicId()
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const {mutate: createChapter, isPending: isPendingCreateChapter} = useCreateChapter()
  const {mutate: createChapterImage, isPending: isPendingCreateChapterImage} = useCreateChapterImage()
  const {mutate: generateUploadUrl} = useGenerateUploadUrl()
  
  if(!comicId) return <div>no comic id</div>
  const {data:comic, isLoading:isLoadingComic} = useGetComicById({comicId})
  async function uploadFile(file: File) {
  // Step 1: ask Convex for a presigned upload URL
  const url = await generateUploadUrl({}, {throwError : true})
  if(!url) throw new Error("failed to generate upload url")
  const result  = await fetch(url, {
       method  : "POST",
       headers : {
          "Content-Type": file.type,
       },
       body: file
    })
    if(!result.ok) throw new Error("failed to upload image")
    const {storageId } = await result.json()
    const fileId = storageId
    return fileId
}

const addChapterImage = async (chapterId: Id<"chapters">, image: File) => {
  const imageId = await uploadFile(image)
  await createChapterImage({
    chapterId: chapterId,
    image: imageId,
  },{
    onSuccess: (data)=>{
      toast.success("chapter image created " + data)
    },
    onError: (error)=>{
      toast.error("could not create chapter image")
    },
  })
}

  const handlePublishComic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!selectedCover || !selectedImages.length || title.trim() === '' )
      return (
        toast.error("please fill all fields")
     )

    const thumbnail = await uploadFile(selectedCover)
    
    
    await createChapter({
      title: title,
      comicId: comicId,
      thumbnail: thumbnail,
    }, {
      onSuccess: (data)=>{
        toast.success("Comic chapter created " + data)
        if(!data) return
        for(const image of selectedImages){
          addChapterImage(data, image)
        }
        router.push(`/comic/${comicId}`)
      },  
        // navigate to comic page
      onError: (error)=>{
        toast.error("could not create comic")
      },
    })



    
  }
  return (
    <div className={cn('flex justify-center w-full', (isPendingCreateChapter || isPendingCreateChapterImage) ? 'cursor-wait opacity-10' : '')}>
      <div className='flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10'>
        <div className='bg-primary/40 rounded-t-2xl text-center text-[12px] md:text-[18px] text-foreground p-4 md:p-4 flex justify-center'>
          Publish a new chapter
        </div>
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex flex-col p-12 gap-12'>
            <UploadCard title='Comic Cover' description='mage size must be 720x1024. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(file) =>{setSelectedCover(file)}} targetRatio={0.77} errormsg='cover size must be near 3:4 ratio (720x1024)' tolerance={0.1}/>
          </div>
          <form onSubmit={handlePublishComic} className='space-y-2.5 p-6  md:p-12 gap-12 relative '>
            <div className='flex flex-col gap-2 py-4'>
                <p className='text-[14px] md:text-[22px] text-foreground text-left'>{comic?.title}</p>
                <p className='text-[8px] md:text-[12px] text-foreground/70 text-left'>by: {comic?.author}</p>
            </div>
                <p>Chapter title</p>
                <Input 
                    disabled={false}
                    value={title}
                    onChange={(e) =>{setTitle(e.target.value)}}
                    placeholder="author "
                    className='bg-background text-foreground border-primary p-4 w-[300px] md:w-[450px] lg:w-[750px] lg:h-[50px] border-1 rounded-2xl text-[14px] md:text-[14px]'
                    required
                />
                <p>Upload files</p>
                <UploadMultipleCard title='Chapter files' description='mage size must be 720x1024. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(files) =>{setSelectedImages(files)}} />
                {/* <p className='h-[100px]'></p> */}
                <div className='flex h-[100px]'>

                </div>
                <div className='flex  justify-center items-center mt-4 lg:mt-4 absolute bottom-[20px] lg:bottom-[20px] w-full lg:right-2 right-1 '>
                <Button type='submit' className=' w-[100px] lg:w-[250px] cursor-pointer rounded-2xl' size='lg' disabled={false}>
                    publish
                </Button>
                </div>
              </form>
        </div>
      </div>
    </div>
  )
}

export default PublishChapterPage