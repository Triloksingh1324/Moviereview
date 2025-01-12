import axios from "axios";
import React, { useEffect, useState } from "react";
// import dotenv from "dotenv"
// dotenv.config({
//   path:"./.env"
// })
const useMovieLink = () => {
  const [movies, setMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const[newReleaseMovies,setNewReleaseMovies]=useState([])
  const[topRatedMovies,setTopRatedMovies]=useState([])
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API;
      setLoading(true); // Start loading before fetching all data
  
      try {
        const [popular, upcoming, newReleases, topRated] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
          axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`),
          axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`),
          axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`),
        ]);
  
        setMovies(popular.data.results);
        setUpcomingMovies(upcoming.data.results);
        setNewReleaseMovies(newReleases.data.results);
        setTopRatedMovies(topRated.data.results);
        setLoading(false); 
      } catch (error) {
        console.log("Error fetching movie data:", error);
      } 
    };
  
    fetchData();
  }, []);
  

  return { movies, upcomingMovies ,newReleaseMovies,topRatedMovies,loading};
};

export default useMovieLink;
