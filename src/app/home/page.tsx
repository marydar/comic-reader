import React from 'react'
import PopularComics from './popularComics'
import ForYouComics from './forYouComics'
import PopularByCategory from './popularByCategory'

const HomePage = () => {
  return (
    <div>
      <PopularComics/>
      <ForYouComics/>
      <PopularByCategory/>
    </div>
  )
}

export default HomePage