import React, { useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { settings } from '../SettingSlider';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
function MovieCards({ movieSent, heading,loading }) {
    const sliderRef = useRef(null);
    const navigate = useNavigate(); 

    const handleMovieClick = (movie) => {
        navigate('/review', { state: { movie } });
    };
    
    return (
        <>
    
        <div className="movieSection">
            <h2>{heading}</h2>
            {loading ? (
                    <div className="cards">
                        <SkeletonTheme baseColor="#202020" highlightColor="#9e9a9a">
                            <Skeleton height={300} duration={2} />
                        </SkeletonTheme>
                    </div>
                ) : (
            <div className="carouselContainer1">
                <button className="prevButton" onClick={() => sliderRef.current.slickPrev()}>
                    <SlArrowLeftCircle />
                </button>
                <div className="movieCards1">
                    <Slider ref={sliderRef} {...settings}>
                        {movieSent.map((movie, index) => (
                            <div
                                key={index}
                                className="movieCardLarge"
                                onClick={() => handleMovieClick(movie)}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title || movie.name}
                                    className="moviePosterLarge"
                                />
                                <div className="ratingContainer">
                                    <span className="star">⭐</span>
                                    <span className="rating">{movie.vote_average}</span>
                                </div>
                                <div className="movieDetails">
                                    <h3>{movie.title || movie.name}</h3>
                                    <p>Release Date: {movie.release_date || movie.first_air_date}</p>
                                    <button className="seeReviewsButton">See reviews</button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                <button className="nextButton" onClick={() => sliderRef.current.slickNext()}>
                    <SlArrowRightCircle />
                </button>
            </div>
                )}
        </div>

</>
                    
);
}

export default MovieCards;
