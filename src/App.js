import React, { useEffect, useState } from "react";
import "./index.css";
import StarRating from "./StarRating";
import logoImage from "./assets/images/cd4e9ae0-2336-4b63-abd0-f3189e4bb25c.png";
import {
  deleteWatched,
  fetchWatchedMovies,
  insertToWatched,
} from "./services/watchedMoviesService";
import {
  deleteBest,
  fetchBestMovies,
  insertToBest,
} from "./services/bestMoviesService";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "69388141";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [best, setBest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState("watchList");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched([...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
    deleteWatched(id);
  }

  function handleDeleteBest(id) {
    setBest((best) => best.filter((movie) => movie.imdbId !== id));
    deleteBest(id);
  }

  function handleAddBest(movie) {
    setBest([...best, movie]);
    insertToBest(movie);
  }

  useEffect(function () {
    async function initialFetch() {
      const resWatched = await fetchWatchedMovies();
      console.log("watched", resWatched);
      const dataWatched = resWatched.map((item) => item.content);
      setWatched(dataWatched);

      const resBest = await fetchBestMovies();
      console.log("best", resBest);
      const dataBest = resBest.map((item) => item.content);
      setBest(dataBest);
    }
    initialFetch();
  }, []);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res) {
            throw new Error("Something went wrong with fetching movies!");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  function onContentChange() {
    if (currentPage === "recomended") {
      setCurrentPage("watchList");
    } else {
      setCurrentPage("recomended");
    }
  }

  function RecomendedButton() {
    return (
      <button className={`recomended-button`} onClick={() => onContentChange()}>
        {currentPage === "recomended" ? `WatchList` : "Top Movies"}
      </button>
    );
  }

  function Logo() {
    return (
      <div className="logo">
        <img
          src={logoImage}
          alt="cant be found"
          style={{ width: "70px" }}
        ></img>
        {/* <span role="img">🍿</span> */}
        <h1>Filmero</h1>
      </div>
    );
  }

  function RecomendedMoviesContainer(best) {
    console.log("best", best);
    return (
      <div className="flip-cards-container">
        <div className="row">
          {best.best.map((item) => (
            <div className="scene">
              <div className="card">
                <div className="card__face card__face--front">
                  <img src={item.poster} />
                </div>
                {/* <iframe
                  className="video"
                  title="Youtube player"
                  sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                  src={`https://youtube.com/embed/0fUCuvNlOCg?autoplay=0`}
                  style={{ width: "240px" }}
                ></iframe> */}
                <div className="card__face card__face--back">
                  <button
                    className="remove-best-movie-button"
                    onClick={() => handleDeleteBest(item.imdbId)}
                  >
                    👎
                  </button>
                  <p>{item.plot}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
        <RecomendedButton></RecomendedButton>
      </NavBar>
      {currentPage === "watchList" ? (
        <Main>
          <Box className="custom-scrollbar-container">
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )}
            {error && <ErrorMessage message={error} />}
          </Box>
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                  onAddBest={handleAddBest}
                />
              </>
            )}
          </Box>
        </Main>
      ) : (
        <Main>
          <RecomendedMoviesContainer best={best}></RecomendedMoviesContainer>
        </Main>
      )}
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

// function Logo(currentPage) {
//   return (
//     <div className="logo">
//       <img src={logoImage} alt="cant be found" style={{ width: "70px" }}></img>
//       {/* <span role="img">🍿</span> */}
//       <h1
//         className={`${currentPage === "watchList" && "underlined"} underlined`}
//       >
//         MyWatchList
//       </h1>
//     </div>
//   );
// }

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  console.log(movies);
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      plot: plot,
      title: title,
      year: year,
      poster: poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
    insertToWatched(newWatchedMovie);
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched, onAddBest }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onDeleteWatched={onDeleteWatched}
          onAddBest={onAddBest}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched, onAddBest }) {
  return (
    <li key={movie.imdbId}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="add-recomended-button"
          onClick={() => onAddBest(movie)}
        >
          <span>+ Recomend!</span>
        </button>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}
