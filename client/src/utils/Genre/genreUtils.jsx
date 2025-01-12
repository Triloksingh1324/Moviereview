export const genreMap = {
    'Action & Adventure': 10759,  // TV show genre
    'Kids': 10762,                // TV show genre
    'News': 10763,                // TV show genre
    'Reality': 10764,             // TV show genre
    'Sci-Fi & Fantasy': 10765,    // TV show genre
    'Soap': 10766,                // TV show genre
    'Talk': 10767,                // TV show genre
    'War & Politics': 10768,      // TV show genre
    'Drama TV': 10766,            // TV show genre (Soap genre)
    'Crime TV': 80,               // Crime TV shows (same as for movies)
    'Documentary TV': 99,         // Documentary TV shows
    'Family TV': 10751,           // Family TV shows
    'Animation TV': 16,           // Animation TV shows (same as for movies)
    // Add more genres as needed
  };
  
  export const getGenreCode=(code)=>{
    return getGenreCode[code] || "Unknown Code"
  }