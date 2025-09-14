"use client"
import React from 'react'
import UploadCard from '@/components/uploadCard'
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import GenreSelector from '@/components/genre-selector'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'
import getUploadImageId from '@/components/upload-image'
import { useCreateComic } from '@/features/comic/api/use-create-comic'
import { toast } from 'sonner'
import { genreEnum } from "../../../convex/genres";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useGenerateUploadUrl } from "@/features/upload-image-url";
import { Id } from "../../../convex/_generated/dataModel";

export type Genre = typeof genreEnum.type;
type createComicValues = {
  title: string,
  author: string,
  description: string,
  thumbnail: Id<"_storage">,
  header: Id<"_storage">,
  genres: Genre[],
}


const PublishComicPage = () => {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedHeader, setSelectedHeader] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const {mutate: createComic, isPending: isPendingCreateComic} = useCreateComic()
  const {mutate: generateUploadUrl} = useGenerateUploadUrl()

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

  const handlePublishComic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!selectedCover || !selectedHeader || !selectedGenres.length || title.trim() === '' || author.trim() === '' || description.trim() === '')
      return (
        toast.error("please fill all fields")
     )
    //  const values:createComicValues = {
    //   title: title,
    //   author: author,
    //   description: description,
    //   thumbnail: null,
    //   header: null,
    //   genres: selectedGenres as Genre[],
    // }
    // const coverId = await getUploadImageId(selectedCover);
    // const headerId = await getUploadImageId(selectedHeader);
    // const coverurl = await generateUploadUrl({}, {throwError : true})
    // if(!coverurl) throw new Error("failed to generate upload url")
    // const coverresult  = await fetch(coverurl, {
    //    method  : "POST",
    //    headers : {
    //       "Content-Type": selectedCover.type,
    //    },
    //    body: selectedCover
    // })
    // if(!coverresult.ok) throw new Error("failed to upload image")
    // const {storageId } = await coverresult.json()
    // const thumbnail = storageId

    // const url = await generateUploadUrl({}, {throwError : true})
    // if(!url) throw new Error("failed to generate upload url")
    // const result  = await fetch(url, {
    //    method  : "POST",
    //    headers : {
    //       "Content-Type": selectedHeader.type,
    //    },
    //    body: selectedHeader
    // })
    // if(!result.ok) throw new Error("failed to upload image")
    // const {storageId2 } = await result.json()
    // const header = storageId

    const thumbnail = await uploadFile(selectedCover)
    const header = await uploadFile(selectedHeader)
    
    
    await createComic({
      title: title,
      author: author,
      description: description,
      thumbnail: thumbnail,
      header: header,
      genres: selectedGenres as Genre[],
    }, {
      onSuccess: (data)=>{
        toast.success("Comic created " + data)
        // navigate to comic page
        // router.push(`/comics/${data}`)
        router.push("/")
      },
      onError: (error)=>{
        toast.error("could not create comic")
      },
    })



    
  }
  return (
    <div className='flex justify-center w-full'>
      <div className='flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10'>
        <div className='bg-primary/40 rounded-t-2xl text-center text-[12px] md:text-[18px] text-foreground p-4 md:p-4 flex justify-center'>
          Publish a new comic
        </div>
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex flex-col p-12 gap-12'>
            <UploadCard title='Comic Cover' description='mage size must be 720x1024. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(file) =>{setSelectedCover(file)}} targetRatio={0.77} errormsg='cover size must be near 3:4 ratio (720x1024)' tolerance={0.1}/>
            <UploadCard title='Cover Header' description='mage size must be 1500x500. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(file) =>{setSelectedHeader(file)}} targetRatio={2.8} errormsg='header size must be near 3:1 ratio (1500x500)' tolerance={0.2}/>
          </div>
          <form onSubmit={handlePublishComic} className='space-y-2.5 p-6  md:p-12 gap-12 relative '>
                <p>Title</p>
                <Input 
                    disabled={false}
                    value={title}
                    onChange={(e) =>{setTitle(e.target.value)}}
                    placeholder="title"
                    className='bg-background text-foreground border-primary p-4 w-[300px] md:w-[450px] lg:w-[750px] lg:h-[50px] border-1 rounded-2xl text-[14px] md:text-[14px]'
                    required
                />
                <p>Author</p>
                <Input 
                    disabled={false}
                    value={author}
                    onChange={(e) =>{setAuthor(e.target.value)}}
                    placeholder="author "
                    className='bg-background text-foreground border-primary p-4 w-[300px] md:w-[450px] lg:w-[750px] lg:h-[50px] border-1 rounded-2xl text-[14px] md:text-[14px]'
                    required
                />
                <p>Description</p>
                <textarea 
                    disabled={false}
                    value={description}
                    onChange={(e) =>{setDescription(e.target.value)}}
                    placeholder="desribe your comic"
                    className=' bg-background text-foreground border-primary p-4 w-[300px] h-[100px] md:w-[450px]  lg:w-[750px] lg:h-[100px] border-1 rounded-2xl placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-[1px] text-[14px] md:text-[14px]'
                    required
                />
                <p>Select Genres</p>
                <GenreSelector selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
                <p className='h-[20px]'></p>
                <div className='flex justify-center items-center mt-4 lg:mt-8 absolute bottom-[20px] lg:bottom-[100px] w-full lg:right-2 right-1 '>
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

export default PublishComicPage