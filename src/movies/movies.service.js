const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
    organization_name : "critic.organization_name",
    preferred_name: "critic.preferred_name",
    surname:"critic.surname"
})

function currentlyShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
        .distinct("m.movie_id")
        .select("m.*")
        .where({ "mt.is_showing": true })

}

function list() {

    return knex("movies").select("*");

}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first()
}

function listTheatersForMovie(movieId) {
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .where({ "mt.movie_id": movieId, "mt.is_showing": true })
        .select("t.*")
}

function listReviewsForMovies(movieId){
    return knex("reviews as r")
        .join("movies as m","m.movie_id","r.movie_id")
        .join("critics as c", "c.critic_id","r.critic_id")
        .select("*")
        .where({"m.movie_id":movieId})
        .then((reviews) => reviews.map(addCritic))
}

module.exports = {
    list,
    currentlyShowing,
    read,
    listTheatersForMovie,
    listReviewsForMovies
};