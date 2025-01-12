import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import { FaThumbsUp, FaCheck } from "react-icons/fa";
import "../css/ReviewPage.css";
import axios from "axios";
import ReviewSection from "../component/reviewSection/ReviewSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserDetail from "../hooks/GetUserDetails";
const ReviewPage = () => {
  const location = useLocation();
  const defaultMovie=localStorage.getItem('defaultMovie')
  const defMovie=JSON.parse(defaultMovie)
  // console.log('def',defMovie)
  const  movie  = location.state?.movie || defMovie;
  if(movie){
    localStorage.setItem('defaultMovie', JSON.stringify(movie));
  }

  // console.log("location movie",movie)
  const [user, setUser] = useState(null);
  const [movieReviews, setMovieReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isReviewVisible, setReviewVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistSuccess, setWatchlistSuccess] = useState(false);
  const [movieReplies, setMovieReplies] = useState([]);
  const [spoiler, setSpoiler] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // console.log("useEffect triggered");
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // console.log("Calling getUserDetail...");
      const userDetails = await getUserDetail();
      console.log("userDetails fetched:", userDetails);
      setUser(userDetails);
      
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const fetchMovieReviews = async () => {
    // console.log("chk",movieReplies)
    try {
      const result = await axios.post(`${apiUrl}/api/users/movie-reviews`, {
        movieId: movie.id,
      },{ withCredentials: true });
      setReviewCount(result.data.data.movieReviewCount);
      console.log("Movies Result", result.data.data.currentMovieReview);
      console.log("spoiler", result.data.data.currentMovieReview);
      setMovieReviews(result.data.data.currentMovieReview || []);
    } catch (err) {
      console.log("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchMovieReviews();
  }, [movie.id]);

  useEffect(() => {
    const fetchMovieLikes = async () => {
      try {
        const res = await axios.post(`${apiUrl}/api/users/movie-likes-count`, {
          movieId: movie.id,
        },{ withCredentials: true });
        setLikeCount(res.data.data.likedCount || 0);
      } catch (err) {
        console.log("Error fetching Movie Likes Count:", err);
      }
    };

    fetchMovieLikes();
  }, [movie.id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/users/movie-is-liked/${movie.id}`,
          { withCredentials: true }
        );
        setHasLiked(result.data.liked);
      } catch (err) {
        console.log("Error fetching like status:", err);
      }
    };

    fetchLikeStatus();
  }, [movie.id]);

  const handleReviewClick = () => {
    if(!user){
      toast.warn("Please Login To Proceed", {
        position: "top-center",
        autoClose: 3000,
      });
      return
    }
    setReviewVisible(!isReviewVisible);
  };

  const handleLikeClick = async () => {
    if(!user){
      toast.warn("Please Login To Proceed", {
        position: "top-center",
        autoClose: 3000,
      });
    return ;
    }
    else if(!user.isVerified){
      toast.warn("Please Verify Your Email First", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const result = await axios.post(`${apiUrl}/api/users/movie-like`, {
        movieId: movie.id,
        movieTitle: movie.title || movie.name,
      },{ withCredentials: true });
      setHasLiked(result.data.message === "Video likes successfully");
      window.location.reload();
    } catch (err) {
      console.log("Error sending like:", err);
      if (err.message == "Request failed with status code 400") {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText || rating === 0) {
      toast.error("Print Write a Review and Enter Rating", {
        position: "top-center",
        autoClose: 3000,
      });

      return;
    }
else if(!user){
  toast.warn("Please Login To Proceed", {
    position: "top-center",
    autoClose: 3000,
  });
return ;
}
else if(!user.isVerified){
  toast.warn("Please Verify Your Email First", {
    position: "top-center",
    autoClose: 3000,
  });
  return;
}
    try {
      const result = await axios.post(`${apiUrl}/api/users/user-review`, {
        reviewText,
        rating,
        spoiler,
        movieId: movie.id,
        movieTitle: movie.title || movie.name,
      },{ withCredentials: true });
      if (result.data.success) {
        toast.success(result.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
      setReviewText("");
      setRating(0);

      // Refresh reviews after submission
      // fetchMovieReviews();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.message == "Request failed with status code 400") {
        toast.warn("Something went wrong", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    const fetchWatchlistStatus = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/users/watch-list/${movie.id}`,
          { withCredentials: true }
        );

        setIsInWatchlist(result.data.movie);
      } catch (err) {
        console.log("Error fetching watchlist status:", err);
      }
    };

    fetchWatchlistStatus();
  }, [movie.id]);

  const handleAddToWatchlist = async () => {
    if(!user){
      toast.warn("Please Login To Proceed", {
        position: "top-center",
        autoClose: 3000,
      });
    return ;
    }
    else if(!user.isVerified){
      toast.warn("Please Verify Your Email First", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const result = await axios.post(`${apiUrl}/api/users/add-to-watchlist`, {
        movieId: movie.id,
        movieTitle: movie.title || movie.name,
      },{ withCredentials: true });

      if (result.data.message == "Added to watchlist successfully") {
        setWatchlistSuccess(true);
        setIsInWatchlist(true); // Movie is now in watchlist
        // setTimeout(() => setWatchlistSuccess(false), 2000);
      } else if (result.data.message == "Removed from watchlist") {
        // If the movie was previously in watchlist and now is being removed
        setWatchlistSuccess(false);
        setIsInWatchlist(false);
      }

      console.log("res", result);
      // alert(result.data.message || "Added to watchlist successfully!");
      const popup = result.data.message || "Added to watchlist successfully!";
      // if (result.data.success) {
      toast.success(popup, {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // }
      // Optionally refresh or update state here if needed
    } catch (err) {
      console.error("Error adding to watchlist:", err);

      if (err.message == "Request failed with status code 400") {
        toast.warn("Please Login To Proceed", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to add watchList", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const movieReplys = async () => {
    try {
      const rep = await axios.post(`${apiUrl}/api/users/movie-reply`, {
        movieId: movie.id,
      },{ withCredentials: true });
      console.log("mr", rep.data.data.movieReplies);
      setMovieReplies(rep.data.data.movieReplies);
      console.log("fd", movieReplies);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    movieReplys();
  }, []);

  const [showEditMode,setShowEditMode]=useState(true)
  const [show,setShow]=useState(true);
  const handleToggle=async()=>{
    setShow(!show)
    setShowEditMode(!showEditMode)
  }
  return (
    <div onClick={handleToggle}>
      <Navbar show={show}/>
      <div className="reviewPageContainer">
        <div className="topSection">
          <div className="movie">
            <div className="movie__intro">
              <img
                className="movie__backdrop"
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={`${movie.title} backdrop`}
              />
              <img
                className="movie__backdrop2"
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={`${movie.title} backdrop`}
              />
              <button
                className={`watchlistButton ${
                  isInWatchlist ? "in-watchlist" : ""
                }`}
                onClick={handleAddToWatchlist}
              >
                {/* {watchlistSuccess ? : "+"} Show tick or '+' */}
                {isInWatchlist ? (
                  <>
                    <FaCheck /> In Watchlist
                  </>
                ) : (
                  "Add to Watchlist"
                )}
              </button>
            </div>
            <div className="movie__detail">
              <div className="movie__detailLeft">
                <div className="movie__posterBox">
                  <img
                    className="movie__poster"
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  />
                 
                </div>
              </div>
              <div className="movie__detailRight">
                <div className="movie__detailRightTop">
                  <div className="movie__name">
                    {movie.original_title || movie.name}
                  </div>
                  <div className="movie__rating">
                    {movie.vote_average} <i className="fas fa-star" />
                    <span className="movie__voteCount">
                      {"(" + movie.vote_count + ") votes"}
                    </span>
                  </div>
                  <div className="movie__releaseDate">
                    {movie.release_date || movie.first_air_date}
                  </div>
                </div>
                <div className="movie__detailRightBottom">
                  <div className="synopsisText">
                    Description
                    
                    </div>
                  <div>{movie.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="reviewSection">
        <div className="buttonsContainer">
          <div className="likeSection">
            <button
              className="likeButton"
              onClick={handleLikeClick}
              style={{ color: hasLiked ? "blue" : "grey" }}
            >
              <FaThumbsUp size={30} />
            </button>
            <p className="likes">{likeCount} Likes</p>
          </div>
          <div className="countReview">
          <div className="count">{reviewCount ? reviewCount : 0} reviews</div>
          <button onClick={handleReviewClick} className="reviewButton">
            {isReviewVisible ? "Hide Review" : "+ Add Review"}
          </button>
          </div>
        </div>

        {isReviewVisible && (
          <div className="reviewInputContainer">
            <textarea
              className="reviewInput"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            />
            <div className="ratingSelection">
              <div className="select">
              <label htmlFor="rating">Select Rating: </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value="0">Select Rating</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              </div>
              <div className="select">
              <label htmlFor="spoiler" className="spoiler">
                Does your review contain spoilers?
              </label>
              <select
                id="spoiler"
                onChange={(e) =>
                  setSpoiler(e.target.value === "Yes" ? true : false)
                }
                className="media"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              </div>
            </div>

            <button className="submitReviewButton" onClick={handleSubmit}>
              Submit Review
            </button>
          </div>
        )}

        <div className="existingReviews">
          <h2>Reviews</h2>
          {movieReviews?.length > 0 ? (
            movieReviews.map((review) => (
              <div key={review._id} className="singleReview">
                <ReviewSection
                  review={review}
                  database={"Review"}
                  movie={movie}
                  showEdit={showEditMode}
                />

                {movieReplies?.length > 0 && (
                  <div className="existingReplies">
                    {movieReplies.map((reply) => (
                      <div key={reply._id} className="reply">
                        {reply.parentId == review._id && (
                          <div>
                            <ReviewSection
                              review={reply}
                              database={"Reply"}
                              movie={movie}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReviewPage;
