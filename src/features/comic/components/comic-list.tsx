"use client"
import React, { use } from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { ChevronDown, TriangleAlert } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { get } from 'http';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GenreSelector from '@/components/genre-selector';
import ComicCard from './comic-card';
import GenreButton from '@/components/genre-button';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { useEffect } from 'react';
import { Search } from "lucide-react"
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

type Comic = {
  _id: Id<"comics">;
  title: string;
  thumbnail: string | null;
//   genres: string[];
};
interface ComicGridRowProps {
  comics: Comic[];
  totalPages: number;
  selectedGenres: string[];
  selectedSort: string;
  currentPage: number
  searchValue: string;
  handleSearch: (search: string) => void;
  handleFilter: (genres: string[], sort: string) => void;
  handlePageChange: (page: number) => void;
//   setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
}
type sortOptions = "views" | "Latest" | "subscriptions" | "names";
export default function ComicList({ comics, totalPages, currentPage, selectedGenres,selectedSort,searchValue, handleSearch, handleFilter, handlePageChange }: ComicGridRowProps) {
    const [showFilter, setShowFilter] = useState(false);
    const [currentSelectedGenres, setCurrentSelectedGenres] = useState<string[]>([]);
    const [currentSelectedSort, setCurrentSelectedSort] = useState<string>("views");
    const [currentSearchValue, setCurrentSearchValue] = useState<string>("");
    useEffect(() => {
      setCurrentSelectedGenres(selectedGenres);
      setCurrentSelectedSort(selectedSort);
      setCurrentSearchValue(searchValue);
    }, [selectedGenres]);
    const sortOption = {
        views: "views",
        Latest: "date",
        subscriptions: "subscriptions",
        names: "names",
    };
    const toggleShowFilter = () => {
      setShowFilter(!showFilter);
    };
    const handleSortClick = (sort: string) => {
        setCurrentSelectedSort(sort);
    };
    const handleFilterClick = () => {
        handleFilter(currentSelectedGenres, currentSelectedSort);
    }
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
                <p className='text-[14px] md:text-[24px] text-foreground text-center'>Sort and filter</p>
            </div>
            <Separator className='text-2xl text-foreground'/>
            <div className={cn('flex w-full flex-col gap-4 py-4 px-2 md:pl-8 lg:w-[800px]', !showFilter && 'hidden')}>
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
                <Separator/>
                {/* sort options */}
                <p className='text-[14px] md:text-[18px] text-foreground/90 text-left'>Sort by</p>
                {/* <div className='flex items-center w-[300px] md:w-[600px] lg:w-[1100px] '> */}
                    <div className=' grid  grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                        <div  onClick={()=>handleSortClick(sortOption.views)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.views ? "active" : "not-active"} genre={sortOption.views}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.Latest)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.Latest ? "active" : "not-active"} genre={sortOption.Latest}/>   
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.subscriptions)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.subscriptions ? "active" : "not-active"} genre={sortOption.subscriptions}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.names)} className='cursor-pointer'>
                        <GenreButton variant={currentSelectedSort === sortOption.names ? "active" : "not-active"} genre={sortOption.names}/>
                        </div>
                    {/* </div> */}
                </div>
                <Separator/>
                {/* genre selector */}
                <div className='flex w-full flex-col gap-4 lg:w-[800px]'>
                    <p className='text-[14px] md:text-[18px] text-foreground/90 text-left'>Filter Genre</p>
                    {/* <div className='flex items-center w-full   bg-amber-500'> */}
                        <GenreSelector selectedGenres={currentSelectedGenres} setSelectedGenres={setCurrentSelectedGenres}/>
                    {/* </div> */}
                    <Separator/>
                </div>
                {/* apply filter */}
                <Button className=' bg-primary text-primary-foreground p-4  justify-center hover:bg-primary/90 cursor-pointer rounded-3xl md:w-[200px] w-full' disabled={false} onClick={handleFilterClick}>Apply Filter</Button>
            </div>
            {/* comis */}
            <div className='flex w-full flex-col gap-4 py-4 '>
                <p className='text-[14px] md:text-[24px] text-foreground text-left'>Filtered Comics</p>
                <Separator/>
                {comics?.length === 0 && (
                                <div className='flex justify-center items-center gap-2 text-primary text-center'>
                                    <TriangleAlert/>
                                    No comics found
                                </div>
                )}
                <div className='flex w-full flex-col gap-4 py-4  justify-center items-center'>
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 w-[310px] md:w-[600px] lg:w-[1100px]'>
                            
                            {comics?.map((comic, index) => (
                                
                                <ComicCard 
                                key={comic._id}
                                _id={comic._id}
                                title={comic.title}
                                views={230}
                                thumbnail={comic.thumbnail}
                                />
                                
                            ))}
                            {/* {comics?.map((comic, index) => (
                                
                                <ComicCard 
                                key={comic._id}
                                _id={comic._id}
                                title={comic.title}
                                views={230}
                                thumbnail={comic.thumbnail}
                                />
                                
                            ))} */}
                            {/* {comics?.map((comic, index) => (
                                
                                <ComicCard 
                                key={comic._id}
                                _id={comic._id}
                                title={comic.title}
                                views={230}
                                thumbnail={comic.thumbnail}
                                />
                                
                            ))}
                            {comics?.map((comic, index) => (
                                
                                <ComicCard 
                                key={comic._id}
                                _id={comic._id}
                                title={comic.title}
                                views={230}
                                thumbnail={comic.thumbnail}
                                />
                                
                            ))} */}
                            
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
