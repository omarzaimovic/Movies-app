import { useEffect, useState } from "react";
import { config } from "./constans.js";

import axios from "axios";
import YouTube from "react-youtube";

import MovieCard from "./Components/MovieCard";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allMovies, setallMovies] = useState({});
  const [playVideo, setPlayVideo] = useState(false);

  const getMovies = async (searchText) => {
    try {
      const type = searchText ? "search" : "discover";
      const {
        data: { results },
      } = await axios.get(`${config.API_URL}/${type}/movie`, {
        params: {
          api_key: process.env.REACT_APP_MOVIE_APP_KEY,
          query: searchText,
        },
      });
      await selectMovie(results[0]);
      setallMovies(results[0]);
      setMovies(results.slice(0, 10));
    } catch (e) {
      console.log(e);
    }
  };

  const getMovie = async (id) => {
    try {
      const { data } = await axios.get(`${config.API_URL}/movie/${id}`, {
        params: {
          api_key: process.env.REACT_APP_MOVIE_APP_KEY,
          append_to_response: "videos",
        },
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const selectMovie = async (movie) => {
    setPlayVideo(false);
    const all = await getMovie(movie.id);
    setallMovies(all);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const renderMovies = () => {
    return movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.length >= 3) {
      getMovies(e.target.value);
    }
  };

  const renderVideo = () => {
    if (allMovies?.videos && allMovies?.videos?.results) {
      const videoTrailer = allMovies?.videos?.results.find(
        (v) => v.name === "Official Trailer"
      );

      if (videoTrailer) {
        return playVideo ? (
          <YouTube
            videoId={videoTrailer.key}
            opts={{ playerVars: { autoplay: 1, controls: 1 } }}
          />
        ) : null;
      }
    }
    return null;
  };

  const renderTrailerButton = () => {
    if (allMovies?.videos && allMovies?.videos?.results) {
      const videoTrailer = allMovies?.videos?.results?.find(
        (v) => v.name === "Official Trailer"
      );

      if (videoTrailer) {
        return (
          <button className="hero-button" onClick={() => setPlayVideo(true)}>
            Play Trailer
          </button>
        );
      }
    }
    return null;
  };

  const renderCloseButton = () => {
    return playVideo ? (
      <button className="hero-button" onClick={() => setPlayVideo(false)}>
        Close
      </button>
    ) : null;
  };

  return (
    <div className="App">
      
      <header className="header">
        <div className="header-text all">
          <span>Movie App</span>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </header>
      <div
        className="hero"
        style={{
          backgroundImage: `url('${config.IMAGE}${allMovies?.backdrop_path}')`,
        }}
      >
        <div className="hero-text all">
          {allMovies?.videos ? renderVideo() : null}
          {renderTrailerButton()}
          {renderCloseButton()}
          <h1 className="hero-title">{allMovies?.title}</h1>
          {allMovies?.overview ? (
            <p className="hero-overview">{allMovies?.overview}</p>
          ) : null}
        </div>
      </div>

      <div className="container all">{renderMovies()}</div>
    </div>
  );
};

export default App;
