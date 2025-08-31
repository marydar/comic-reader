"use client"
import React from 'react'
import UploadCard from '@/components/uploadCard'
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import GenreSelector from '@/components/genre-selector'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

const PublishComicPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedHeader, setSelectedHeader] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const handlePublishComic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!selectedCover || !selectedHeader || !selectedGenres.length) 
      return (
        <TriangleAlert className='size-4'>please fill all fields</TriangleAlert>
     )
    
  }
  return (
    <div className='flex justify-center w-full'>
      <div className='flex flex-col  w-[300px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-10'>
        <div className='bg-primary/40 rounded-t-2xl text-center text-[12px] md:text-[18px] text-foreground p-4 md:p-4 flex justify-center'>
          Publish your new comic
        </div>
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex flex-col p-12 gap-12'>
            <UploadCard title='Comic Cover' description='mage size must be 720x1024. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(file) =>{setSelectedCover(file)}}/>
            <UploadCard title='Cover Header' description='mage size must be 1500x500. Image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed.' onFileSelect={(file) =>{setSelectedHeader(file)}}/>
          </div>
          <form onSubmit={handlePublishComic} className='space-y-2.5  p-12 gap-12 relative '>
                <p>Title</p>
                <Input 
                    disabled={false}
                    value={title}
                    onChange={(e) =>{setTitle(e.target.value)}}
                    placeholder="title"
                    className='bg-background text-foreground border-primary p-4 md:w-[450px] lg:w-[750px] lg:h-[50px] border-1 rounded-2xl text-[14px] md:text-[14px]'
                    required
                />
                <p>Author</p>
                <Input 
                    disabled={false}
                    value={author}
                    onChange={(e) =>{setAuthor(e.target.value)}}
                    placeholder="author "
                    className='bg-background text-foreground border-primary p-4 md:w-[450px] lg:w-[750px] lg:h-[50px] border-1 rounded-2xl text-[14px] md:text-[14px]'
                    required
                />
                <p>Description</p>
                <textarea 
                    disabled={false}
                    value={description}
                    onChange={(e) =>{setDescription(e.target.value)}}
                    placeholder="desribe your comic"
                    className=' bg-background text-foreground border-primary p-4 md:w-[450px]  lg:w-[750px] lg:h-[100px] border-1 rounded-2xl placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-[1px] text-[14px] md:text-[14px]'
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