const axios = require('axios')
const Redis = require('ioredis')
const redis = new Redis()
module.exports = {
  Query: {
    movies: async () => {
      const cache = await redis.get('movies')
      if (cache) {
        return JSON.parse(cache)
      }

      return axios.get(`http://localhost:3001/movies`).then(({ data }) => {
        redis.set('movies', JSON.stringify(data.movies))
        return data.movies
      })
    },
    movie: (_, { id }) => {
      return axios
        .get(`http://localhost:3001/movies/${id}`)
        .then(({ data }) => {
          return data.movie
        })
    },
    tvseries: async () => {
      const cache = await redis.get('tvseries')
      if (cache) {
        return JSON.parse(cache)
      }

      return axios.get(`http://localhost:3002/tvseries`).then(({ data }) => {
        redis.set('tvseries', JSON.stringify(data.tvseries))
        return data.tvseries
      })
    },
    tvserie: (_, { id }) => {
      return axios
        .get(`http://localhost:3002/tvseries/${id}`)
        .then(({ data }) => {
          return data.tvserie
        })
    }
  },
  Mutation: {
    addMovie: async (_, input) => {
      return axios
        .post(`http://localhost:3001/movies`, input)
        .then(({ data }) => {
          redis.del('movies')
          return data.movie[0]
        })
    },
    updateMovie: async (_, input) => {
      return axios
        .put(`http://localhost:3001/movies/${input.id}`, input)
        .then(({ data }) => {
          redis.del('movies')
          return data.movie
        })
    },
    deleteMovie: async (_, input) => {
      return axios
        .delete(`http://localhost:3001/movies/${input.id}`)
        .then(({ data }) => {
          redis.del('movies')
          return data
        })
    },
    addTVSerie: async (_, input) => {
      return axios
        .post(`http://localhost:3002/tvseries`, input)
        .then(({ data }) => {
          redis.del('tvseries')
          return data.tvserie[0]
        })
    },
    updateTVSerie: async (_, input) => {
      return axios
        .put(`http://localhost:3002/tvseries/${input.id}`, input)
        .then(({ data }) => {
          redis.del('tvseries')
          return data.tvserie
        })
    },
    deleteTVSerie: async (_, input) => {
      return axios
        .delete(`http://localhost:3002/tvseries/${input.id}`)
        .then(({ data }) => {
          redis.del('tvseries')
          return data
        })
    }
  }
}
