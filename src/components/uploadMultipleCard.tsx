"use client"
import React, { useState, useRef } from "react"
import { PlusCircleIcon, Triangle, TriangleAlert, Upload, X } from "lucide-react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"

interface Props {
  title: string
  description: string
  errormsg?: string
  onFileSelect?: (files: File[]) => void
}

export default function UploadCard({
  title,
  description,
  onFileSelect,
  errormsg,
}: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // validate width == 800px
  const validateImageWidth = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(img.width === 800)
      }
      img.onerror = () => resolve(false)
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFiles = async (selectedFiles: FileList | File[]) => {
    setError(null)

    const newFiles: File[] = []
    const newPreviews: string[] = []

    for (const file of Array.from(selectedFiles)) {
      const isValid = await validateImageWidth(file)
      if (!isValid) {
        setError(errormsg ?? "Image width must be exactly 800px")
        continue
      }
      newFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      const updatedPreviews = [...previews, ...newPreviews]

      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      onFileSelect?.(updatedFiles)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleDropZone = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // reorder helper
  const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newFiles = reorder(files, result.source.index, result.destination.index)
    const newPreviews = reorder(
      previews,
      result.source.index,
      result.destination.index
    )
    setFiles(newFiles)
    setPreviews(newPreviews)
    onFileSelect?.(newFiles)
  }

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onFileSelect?.(updatedFiles)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
    <div className="flex  gap-2 border-1 border-primary rounded-2xl p-4 max-h-[300px] lg:max-h-[380px] overflow-scroll scrollbar">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={handleClick}
        onDrop={handleDropZone}
        onDragOver={(e) => e.preventDefault()}
        className="h-[120px] min-w-[80px] max-w-[80px] lg:min-w-[100px] lg:max-w-[100px] lg:h-[150px] bg-primary/20 rounded-2xl text-center text-[10px] md:text-[14px] text-foreground flex justify-center items-center flex-col gap-2"
      >
            <PlusCircleIcon className="text-primary text-2xl" />
            {/* <p className="text-center text-foreground/60 lg:text-[12px] px-6">
              
            </p> */}
      </div>
      
      {previews.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="previews" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1 w-full"
                >
                  {previews.map((src, idx) => (
                    <Draggable
                      key={idx.toString()}
                      draggableId={idx.toString()}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative group"
                        >
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="object-cover min-w-[80px] max-w-[80px] h-[120px] lg:min-w-[100px] lg:max-w-[100px] lg:h-[150px] rounded-md"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemove(idx)
                            }}
                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full">
          </div>
        )}
    </div>
      <p className="text-center text-foreground lg:text-[14px]">{title}</p>
      <p className="text-center text-foreground/60 lg:text-[12px]">
        {description}
      </p>
      {error && <p className="text-center text-red-500 lg:text-[12px]">{error}</p>}
    </div>
  )
}
