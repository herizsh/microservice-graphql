const ObjectId = require('mongodb').ObjectId

class MovieController {
  static findAll(req, res, next) {
    const collection = req.db.collection('movies')
    collection
      .find({})
      .toArray()
      .then(movies => {
        res.status(200).json({ movies })
      })
      .catch(next)
  }
  static create(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const collection = req.db.collection('movies')

    const data = {
      title,
      overview,
      poster_path,
      popularity,
      tags
    }
    collection
      .insertOne({ data })
      .then(result => {
        res.status(201).json({ movie: result.ops })
      })
      .catch(next)
  }

  static update(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const collection = req.db.collection('movies')

    const query = {
      _id: ObjectId(req.params.id)
    }

    const newValues = {
      $set: { data: { title, overview, poster_path, popularity, tags } }
    }
    collection
      .updateOne(query, newValues)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    const collection = req.db.collection('movies')

    const query = {
      _id: ObjectId(req.params.id)
    }
    collection
      .deleteOne(query)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(next)
  }
}

module.exports = MovieController
