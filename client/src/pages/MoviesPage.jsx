import React, { useState, useEffect ,useRef} from 'react';
import Navbar from '../component/Navbar';
import useMovieLink from '../hooks/useMovieLink';
import '../css/MoviesPage.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { genreMovieMap } from '../utils/Genre/genreMovieMap';
import FilterOptions from '../component/Filter';
import FilterCard from '../component/FilterCards/FilterCard';
import MovieCards from '../component/movieCards/MovieCards';

const MoviesPage = () => {
  const endPoint="movie"
  const [show,setShow]=useState(true);
  const { movies, upcomingMovies,loading } = useMovieLink();
  const [appliedFilters, setAppliedFilters] = useState({
    genre: '',
    language: '',
    releaseYear: '',
    popularity: ''
  });

  const handleToggle=async()=>{
    setShow(!show)
  }

  
  return (
    <div className="newMoviesPageContainer" onClick={handleToggle}>
      <Navbar show={show}/>
      <FilterOptions setAppliedFilters={setAppliedFilters} genreMap={genreMovieMap} />
      <FilterCard setAppliedFilters={appliedFilters} endPoint={endPoint}/>
     
      <MovieCards movieSent={movies} heading={"New Releases"} loading={loading}/>
      <MovieCards movieSent={upcomingMovies} heading={"Upcoming Movies"} loading={loading}/>
      
      
     
    </div>
  );
};

export default MoviesPage;
