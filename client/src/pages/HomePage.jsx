import React, { useEffect, useState, useRef } from "react";
import useMovieLink from "../hooks/useMovieLink";
import Navbar from "../component/Navbar";
import axios from "axios";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import MovieCards from "../component/movieCards/MovieCards";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from "@auth0/auth0-react";
import getUserDetail from '../hooks/GetUserDetails';
function HomePage() {
  const { user,loginWithRedirect, isAuthenticated ,logout} = useAuth0();
  const { newReleaseMovies, topRatedMovies,loading } = useMovieLink();
  const [user1, setUser] = useState(null);
 const [show,setShow]=useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleMovieClick = (movie) => {
    navigate("/review", { state: { movie } });
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetail();
      // console.log("Fetched user details:", userDetails);
      setUser(userDetails);
      
    };

    fetchUserDetails();
  }, []); 

  useEffect(() => {
    const sendUserDataToBackend = async () => {
      console.log("6",user)
      // generateString()
      if (isAuthenticated && user.email && !user1) {
        try {

          const generateRandomString = () => {
            return Math.floor(100 + Math.random() * 900).toString(); // Ensures a 3-digit number
          };
  
          // Concatenate name with the random string
          const name = `${user.given_name}${generateRandomString()}`;
          
          const userData = { email: user.email ,name,picture:user.picture};
          const result = await axios.post(`${apiUrl}/api/users/auth-login`, userData
            ,{ withCredentials: true }
          );

          if (result.data.success) {
            if (localStorage.getItem('toast')=='true') {
              toast.success("Logged in successfully!", {
                position: "top-center",
                autoClose: 3000,   
              });
              localStorage.setItem('toast', 'false');
              window.location.reload();
                // Set localStorage item to indicate that the toast has been shown
            }
            
            //
          }}catch (error) {
          console.error("Backend request error:", error);
          toast.error("Error sending user data to backend.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
    };

    sendUserDataToBackend();
  }, [isAuthenticated,user,user1]);
  const handleToggle=async()=>{
    setShow(!show)
  }
  return (
    <div className="homePageContainer" onClick={handleToggle}>
      <Navbar show={show}/>

      {/* Featured Movie Slider */}

      <div className="movieSlider">
        <Carousel
          showArrows={true}
          showIndicators={false}
          // selectedItem={3},
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={3000}
        >
          {topRatedMovies.map((movie, index) => (
            <div
              key={index}
              className="movieContainer"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="moviePoster"
              />
            </div>
          ))}
        </Carousel>
      </div>
      <MovieCards movieSent={newReleaseMovies} heading={"Trending Today"} loading={loading} />
      <MovieCards movieSent={topRatedMovies} heading={"Top Rated"} loading={loading}/>

      <ToastContainer/>
    </div>
  );
}

export default HomePage;
