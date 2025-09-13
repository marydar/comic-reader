"use client"
import React, { use } from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { ChevronDown } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { get } from 'http';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GenreSelector from '@/components/genre-selector';
import PlaylistCard from './playlist-card';
import GenreButton from '@/components/genre-button';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { useEffect } from 'react';
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { TriangleAlert } from 'lucide-react';

type PlaylistInformation = {
  _id: Id<"playlists">;
  title: string;
  numberOfComics: number;
  thumbnail: string | null;
//   genres: string[];
};
interface PlaylistListProps {
  playlists: PlaylistInformation[];
  totalPages: number;
  selectedSort: string;
  searchValue: string;
  currentPage: number
  handleFilter: (sort: string) => void;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
//   setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
}
type sortOptions = "numberOfComics" | "Latest" | "saves" | "names";
export default function PlaylistList({ playlists, totalPages, currentPage,selectedSort,searchValue, handleFilter, handlePageChange, handleSearch }: PlaylistListProps) {
    const [showFilter, setShowFilter] = useState(false);
    const [currentSelectedSort, setCurrentSelectedSort] = useState<string>("saves");
    const [currentSearchValue, setCurrentSearchValue] = useState<string>("");
    useEffect(() => {
      setCurrentSelectedSort(selectedSort);
      setCurrentSearchValue(searchValue);
    }, [selectedSort]);
    const sortOption = {
        numberOfComics: "numberOfComics",   
        Latest: "date",
        saves: "saves",
        names: "names",
    };
    const toggleShowFilter = () => {
      setShowFilter(!showFilter);
    };
    const handleSortClick = (sort: string) => {
        setCurrentSelectedSort(sort);
        handleFilter(sort);
    };
    const handlePagination = (page: number) => {
        console.log("page changed to " + page);
        handlePageChange(page);
    };
    const handleSearchClick = () => {
        handleSearch(currentSearchValue);
        setCurrentSearchValue("");
    }
    //w-[350px] md:w-[800px] lg:w-[1200px]
  return (
    <div className='flex justify-center w-full'>
      <div className='flex flex-col w-full items-center justify-center rounded-2xl  my-4 md:my-10'>
        <div className='flex flex-col gap-4'>
            <div className='flex w-full items-center gap-4 pt-4 cursor-pointer' onClick={toggleShowFilter}>
                <ChevronDown className='text-foreground text-2xl'/>
                <p className='text-[14px] md:text-[24px] text-foreground text-center'>Sort and Search</p>
            </div>
            <Separator className='text-2xl text-foreground'/>
            <div className={cn('flex w-full flex-col gap-4 py-4 px-2 md:pl-8 lg:w-[800px]', showFilter && 'hidden')}>
                <div className="flex gap-4 bg-background text-primary-foreground lg:w-sm md:w-[200px] h-[35px] justify-center items-center hover:bg-background/90 cursor-pointer rounded-3xl">
                    <Input 
                    placeholder="Search playlists" 
                    className="text-primary"
                    value={currentSearchValue}
                    onChange={e => setCurrentSearchValue(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault() // prevent form submit or accidental dialog close
                            handleSearchClick()
                        }
                    }}
                    />
                    <Search className=" text-primary text-center" onClick={handleSearchClick} />
                </div>
                {/* sort options */}
                <div>
                <p className='text-[14px] md:text-[18px] text-foreground/90 text-left'>Sort by</p>
                {/* <div className='flex items-center w-[300px] md:w-[600px] lg:w-[1100px] '> */}
                    <div className=' grid  grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 my-4'>
                        <div  onClick={()=>handleSortClick(sortOption.numberOfComics)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.numberOfComics ? "active" : "not-active"} genre={"Comics"}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.Latest)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.Latest ? "active" : "not-active"} genre={sortOption.Latest}/>   
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.saves)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.saves ? "active" : "not-active"} genre={sortOption.saves}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.names)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.names ? "active" : "not-active"} genre={sortOption.names}/>
                        </div>
                    {/* </div> */}
                </div>
                </div>
                <Separator/>
            </div>
            {/* comis */}
            <div className='flex w-full flex-col gap-4 py-4 '>
                <p className='text-[14px] md:text-[24px] text-foreground text-left'>Filtered Comics</p>
                <Separator/>
                {playlists?.length === 0 && (
                                <div className='flex justify-center items-center gap-2 text-primary text-center'>
                                    <TriangleAlert/>
                                    No ComicLists found
                                </div>
                )}
                <div className='flex w-full flex-col gap-4 py-4  justify-center items-center'>
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px]'>
                            {playlists?.map((pl, index) => (
                                
                                <PlaylistCard 
                                key={pl._id}
                                _id={pl._id}
                                title={pl.title}
                                numberOfComics={pl.numberOfComics}
                                thumbnail={pl.thumbnail}
                                />
                                
                            ))}
                           
                            
                    </div>
                </div>
            </div>
            {totalPages > 0 &&  
            <Pagination
                totalPages={totalPages}
                initialPage={currentPage}
                onPageChange={handlePagination}
            />
            }

        </div>
      </div>
    </div>
  )
}
