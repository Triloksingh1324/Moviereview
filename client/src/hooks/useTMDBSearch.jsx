const loadMovies = async (searchItem) => {
  const apiKey = import.meta.env.VITE_TMDB_API;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchItem}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.results) {
        return data.results;
      }
      console.log("dat",data)
      return [];
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  
  export default loadMovies;
  