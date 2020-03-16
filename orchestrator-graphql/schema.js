const { gql } = require('apollo-server')

const typeDefs = gql`
  type Movie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
  type TVSerie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
  type DeleteResult {
    _id: ID
    msg: String
    status: Int
  }
  type Query {
    movies: [Movie]!
    movie(id: ID!): Movie
    tvseries: [TVSerie]!
    tvserie(id: ID!): TVSerie
  }
  type Mutation {
    addMovie(
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): Movie
    updateMovie(
      id: ID
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): Movie
    deleteMovie(id: ID): DeleteResult
    addTVSerie(
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): TVSerie
    updateTVSerie(
      id: ID
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): TVSerie
    deleteTVSerie(id: ID): DeleteResult
  }
`
module.exports = typeDefs
