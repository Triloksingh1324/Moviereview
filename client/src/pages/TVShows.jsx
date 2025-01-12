import React, { useState } from "react";
import Navbar from "../component/Navbar";
import useTVShowsLink from "../hooks/useTVShowsLink";
import FilterOptions from "../component/Filter";
import { genreMap } from "../utils/Genre/genreUtils";
import FilterCard from "../component/FilterCards/FilterCard";
import { networkIds } from "../utils/NetworkIDs/TVShowsNetworkId";
import MovieCards from "../component/movieCards/MovieCards";
function TVShows() {
  const endPoint = "tv";
  const languageHindi="hi"
  const languagePunjabi="pa"

  const [appliedFilters, setAppliedFilters] = useState({
    genre: "",
    language: "",
    releaseYear: "",
    popularity: "",
  });
  const { tvShows, newWebSeries,hindi,punjabi,loading } = 
  useTVShowsLink(networkIds,languageHindi,languagePunjabi);
 
  const [show,setShow]=useState(true);
  const handleToggle=async()=>{
    setShow(!show)
  }
  return (
    <div onClick={handleToggle}>
      <Navbar show={show}/>

      <FilterOptions
        setAppliedFilters={setAppliedFilters}
        genreMap={genreMap}  
      />

      <FilterCard setAppliedFilters={appliedFilters} endPoint={endPoint} netId={networkIds} />
      <MovieCards movieSent={tvShows} heading={"Top Rated"} loading={loading}/>
      <MovieCards movieSent={newWebSeries} heading={"New Releases"} loading={loading}/>
      <MovieCards movieSent={hindi} heading={"Hindi"} loading={loading}/>
      <MovieCards movieSent={punjabi} heading={"Punjabi"} loading={loading}/>
    </div>
  );
}

export default TVShows;
