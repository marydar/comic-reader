import React, { useState } from "react";
import { genres } from "./genres";
import GenreButton from "./genre-button";

type GenreSelectorProps = {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function GenreSelector({ selectedGenres, setSelectedGenres }: GenreSelectorProps) {

  const toggleGenre = (genre: string) => {
    if(selectedGenres.includes(genre)){
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    }else{
      setSelectedGenres([...selectedGenres, genre])
    }
    console.log(selectedGenres)
  };

  return (
    <div className=' grid  grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 my-4'>
        {genres.map((genre) => (
            <div  key={genre} onClick={() => toggleGenre(genre)}>
                <GenreButton key={genre} variant={selectedGenres.includes(genre) ? "active" : "not-active"} genre={genre} />   
            </div>
        ))}
    </div>
  )


}