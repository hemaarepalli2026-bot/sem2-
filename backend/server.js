
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/movieclub")
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log("MongoDB Error:", err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    director: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model("Movie", movieSchema);

// GET - View all movies
app.get("/api/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - Add movie
app.post("/api/movies", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT - Update movie
app.put("/api/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE - Delete movie
app.delete("/api/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json({ message: "Movie deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
