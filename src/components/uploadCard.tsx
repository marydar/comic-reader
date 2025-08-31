import React from 'react'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { useRef } from 'react'

interface Props {
    title: string
    description: string
    onFileSelect?: (file: File) => void
    
}

export default function uploadCard({title, description, onFileSelect}: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className='flex flex-col gap-2 lg:w-[200px]'>
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
        <div 
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className='h-[200px] md:w-[150px] lg:w-[200px] lg:h-[300px] bg-primary/20 rounded-2xl text-center text-[10px] md:text-[14px] text-foreground  flex justify-center items-center flex-col gap-2'
        >
            {preview ? (
          <img
            src={preview}
            alt="preview"
            className="object-cover w-full h-full rounded-2xl"
          />
        ) : (
          <>
            <Upload className="text-primary text-2xl" />
            <p className="text-center text-foreground/60 lg:text-[12px] px-6">
              Click to upload or drag and drop
            </p>
          </>
        )}
        </div>
        <p className=' text-center text-foreground lg:text-[14px]'>{title}</p>
        <p className=' text-center text-foreground/60 lg:text-[12px]'>{description}</p>
    </div>
  )
}
