"use client"
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { ChevronDown } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { get } from 'http';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GenreSelector from '@/components/genre-selector';
import ComicCard from './comic-card';
import GenreButton from '@/components/genre-button';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';

type Comic = {
  _id: Id<"comics">;
  title: string;
  thumbnail: string | null;
//   genres: string[];
};
interface ComicGridRowProps {
  comics: Comic[];
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSort: string | "views";
  setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
  handleFilter: () => void;
//   setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
}
type sortOptions = "views" | "Latest" | "subscriptions" | "names";
export default function ComicList({ comics, selectedGenres, setSelectedGenres,selectedSort, setSelectedSort, handleFilter }: ComicGridRowProps) {
    const [showFilter, setShowFilter] = useState(false);
    // const [selectedSort, setSelectedSort] = useState<string>("views");
    // const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const sortOption = {
        views: "views",
        Latest: "Latest",
        subscriptions: "subscriptions",
        names: "names",
    };
    const toggleShowFilter = () => {
      setShowFilter(!showFilter);
    };
    const handleSortClick = (selectedSort: string) => {
       setSelectedSort(selectedSort);
    };
    // const handleFilter = () => {
    //     console.log("filter clicked");
    // };
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
            <div className={cn('flex w-full flex-col gap-2 py-4 pl-8', showFilter && 'hidden')}>
                {/* sort options */}
                <p className='text-[14px] md:text-[18px] text-foreground/90 text-left'>Sort by</p>
                <div className='flex items-center w-[300px] md:w-[600px] lg:w-[1100px] '>
                    <div className=' grid  grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 my-4'>
                        <div  onClick={()=>handleSortClick(sortOption.views)} className='cursor-pointer'>
                        <GenreButton variant={selectedSort === sortOption.views ? "active" : "not-active"} genre={sortOption.views}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.Latest)} className='cursor-pointer'>
                        <GenreButton variant={selectedSort === sortOption.Latest ? "active" : "not-active"} genre={sortOption.Latest}/>   
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.subscriptions)} className='cursor-pointer'>
                        <GenreButton variant={selectedSort === sortOption.subscriptions ? "active" : "not-active"} genre={sortOption.subscriptions}/>
                        </div>
                        <div  onClick={()=>handleSortClick(sortOption.names)} className='cursor-pointer'>
                        <GenreButton variant={selectedSort === sortOption.names ? "active" : "not-active"} genre={sortOption.names}/>
                        </div>
                    </div>
                </div>
                <Separator/>
                {/* genre selector */}
                <p className='text-[14px] md:text-[18px] text-foreground/90 text-left'>Filter Genre</p>
                <div className='flex items-center w-[300px] md:w-[600px] lg:w-[1100px] '>
                    <GenreSelector selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
                </div>
                <Separator/>
                {/* apply filter */}
                <Button className=' bg-primary text-primary-foreground p-4  justify-center hover:bg-primary/90 cursor-pointer rounded-3xl md:w-[200px] w-full' disabled={false} onClick={handleFilter}>Apply Filter</Button>
            </div>
            {/* comis */}
            <div className='flex w-full flex-col gap-4 py-4 '>
                <p className='text-[14px] md:text-[24px] text-foreground text-left'>Filtered Comics</p>
                <Separator/>
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
                            {comics?.map((comic, index) => (
                                
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
                                
                            ))}
                            {comics?.map((comic, index) => (
                                
                                <ComicCard 
                                key={comic._id}
                                _id={comic._id}
                                title={comic.title}
                                views={230}
                                thumbnail={comic.thumbnail}
                                />
                                
                            ))}
                            
                    </div>
                </div>
            </div>
            <Pagination
                totalPages={50}
                onPageChange={(page) => console.log("Now on page:", page)}  
            />

            
        </div>
      </div>
    </div>
  )
}
