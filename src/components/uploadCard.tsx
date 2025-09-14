import React from 'react'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { useRef } from 'react'

interface Props {
    title: string
    description: string
    targetRatio: number
    errormsg?: string
    onFileSelect?: (file: File) => void
    tolerance?: number 
    
}
// const TARGET_RATIO = 230 / 300; // ≈ 0.77
// const TOLERANCE = 0.1; 

export default function uploadCard({title, description, onFileSelect, errormsg, targetRatio, tolerance}: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const f_tolerance = tolerance??0.1

    const validateImageAspectRatio = (file: File) => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      const min = targetRatio * (1 - f_tolerance);
      const max = targetRatio * (1 + f_tolerance);
      const isValid = ratio >= min && ratio <= max;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};
  const handleFile = async (file: File) => {
    setError(null);

  const isValid = await validateImageAspectRatio(file);
  if (!isValid) {
    setError(errormsg??description);
    return;
  }

  const url = URL.createObjectURL(file);
  setPreview(url);
  onFileSelect?.(file);
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };
  

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
        {error && <p className='text-center text-red-500 lg:text-[12px]'>{error}</p>}
    </div>
  )
}
