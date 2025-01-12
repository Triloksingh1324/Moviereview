import React, {  useState } from "react";
import Navbar from "../component/Navbar";
import useTVShowsLink from "../hooks/useTVShowsLink";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FilterOptions from "../component/Filter";
import { genreMap } from "../utils/Genre/genreUtils";
import FilterCard from "../component/FilterCards/FilterCard";
import { networkIds } from "../utils/NetworkIDs/webSeriesNetworkId";
import MovieCards from "../component/movieCards/MovieCards";
// import { networkIds } from "../utils/NetworkIDs/TVShowsNetworkId";
function WebSeriesPage() {
  const endPoint="tv"
  const [appliedFilters, setAppliedFilters] = useState({
    genre: '',
    language: '',
    releaseYear: '',
    popularity: ''
  });
  const { tvShows, newWebSeries, loading} = useTVShowsLink(networkIds);
  
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
      
<FilterCard setAppliedFilters={appliedFilters} endPoint={endPoint} netId={networkIds}/>
<MovieCards movieSent={tvShows} heading={"Top Rated"} loading={loading}/>
<MovieCards movieSent={newWebSeries} heading={"New Releases"} loading={loading}/>

      
    </div>
  );
}

export default WebSeriesPage;
