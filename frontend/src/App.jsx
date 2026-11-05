
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genre: "",
    releaseDate: "",
    releaseYear: "",
    rating: "",
    director: ""
  });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/api/movies";

  const fetchMovies = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieData = {
      ...form,
      releaseYear: Number(form.releaseYear),
      rating: Number(form.rating)
    };

    try {
      const url = editId ? `${API}/${editId}` : API;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData)
      });

      if (!res.ok) throw new Error("Unable to save movie");

      alert(editId ? "Movie Updated!" : "Movie Added!");

      setForm({
        title: "",
        genre: "",
        releaseDate: "",
        releaseYear: "",
        rating: "",
        director: ""
      });

      setEditId(null);
      fetchMovies();
    } catch (error) {
      alert(error.message);
    }
  };

  const editMovie = (movie) => {
    setForm({
      title: movie.title,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      director: movie.director
    });
    setEditId(movie._id);
  };

  const deleteMovie = async (id) => {
    if (window.confirm("Delete this movie?")) {
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Delete failed");
        fetchMovies();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🎬 Movie Club Management</h1>
        <p>Manage Your Favourite Movies</p>
      </header>

      <main>
        <section className="form-section">
          <h2>{editId ? "Update Movie" : "Add New Movie"}</h2>

          <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Movie Title"
              value={form.title} onChange={handleChange} required />

            <input name="genre" placeholder="Movie Genre"
              value={form.genre} onChange={handleChange} required />

            <label>Release Date</label>
            <input type="date" name="releaseDate"
              value={form.releaseDate} onChange={handleChange} required />

            <input type="number" name="releaseYear"
              placeholder="Release Year" value={form.releaseYear}
              onChange={handleChange} required />

            <input type="number" name="rating"
              placeholder="Rating (0-10)" min="0" max="10"
              step="0.1" value={form.rating}
              onChange={handleChange} required />

            <input name="director" placeholder="Director Name"
              value={form.director} onChange={handleChange} required />

            <button type="submit">
              {editId ? "Update Movie" : "Add Movie"}
            </button>
          </form>
        </section>

        <section className="movies-section">
          <h2>Movie Collection ({movies.length})</h2>

          {movies.length === 0 && <p>No movies added yet.</p>}

          <div className="movie-list">
            {movies.map((movie) => (
              <div className="movie-card" key={movie._id}>
                <h3>{movie.title}</h3>
                <p><b>Genre:</b> {movie.genre}</p>
                <p><b>Release Date:</b> {movie.releaseDate}</p>
                <p><b>Year:</b> {movie.releaseYear}</p>
                <p><b>Rating:</b> ⭐ {movie.rating}/10</p>
                <p><b>Director:</b> {movie.director}</p>

                <button onClick={() => editMovie(movie)}>Edit</button>
                <button className="delete"
                  onClick={() => deleteMovie(movie._id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
