import { config } from "../constans";
const MovieCard = ({ movie, selectMovie }) => {
  //const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
  return (
    <div className={"movie-card"} onClick={() => selectMovie(movie)}>
      {movie.poster_path ? (
        <img
          className={"movie-image"}
          src={`${config.IMAGE_PATH}${movie.poster_path}`}
          alt=""
        />
      ) : (
        <div className="movies-placeholder">No Image found</div>
      )}
      <h5 className={"movie-title"}>{movie.title}</h5>
    </div>
  );
};
export default MovieCard;
