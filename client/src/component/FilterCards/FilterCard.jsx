import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCards from "../movieCards/MovieCards";
import useFilterMovies from "../../hooks/useFilterMovies";
function FilterCard({ setAppliedFilters,endPoint,netId }) {
    const {  filteredShows,showsData,loading} = useFilterMovies(setAppliedFilters,endPoint,netId);
  
    console.log("Filtered Shows Length:", filteredShows.length);
  
  return (
    <>
    {filteredShows.length > 0 ? (
    <MovieCards movieSent={filteredShows} heading={"Based on your search"} loading={loading}/>
    
      ) : (
      //  {showsData && <h2>He</h2>}
      showsData && <h3 style={{marginLeft:"40px"}}>No Data Found Based On Your Search </h3>
      )}
      </>
  )
  
}

export default FilterCard