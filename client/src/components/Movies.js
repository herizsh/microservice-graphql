import React, { useState } from 'react'
import {
  Form,
  Container,
  CardColumns,
  Card,
  Button,
  Modal
} from 'react-bootstrap'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const ADD_MOVIE = gql`
  mutation addMovie(
    $title: String
    $overview: String
    $poster_path: String
    $popularity: Float
    $tags: [String]
  ) {
    addMovie(
      title: $title
      overview: $overview
      poster_path: $poster_path
      popularity: $popularity
      tags: $tags
    ) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const MOVIES = gql`
  {
    movies {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const DELETE_MOVIE = gql`
  mutation deleteMovie($id: ID) {
    deleteMovie(id: $id) {
      _id
      msg
      status
    }
  }
`

export default function Movies() {
  const { loading, error, data } = useQuery(MOVIES)

  const [title, setTitle] = useState('')
  const [overview, setOverview] = useState('')
  const [poster_path, setPosterpath] = useState('')
  const [popularity, setPopularity] = useState('')
  const [tags, setTags] = useState([])

  const handleOnSubmitMovie = event => {
    event.preventDefault()
    addMovie({ variables: { title, overview, poster_path, popularity, tags } })

    setTitle('')
    setOverview('')
    setPosterpath('')
    setPopularity('')
    setTags([])
  }

  const [addMovie] = useMutation(ADD_MOVIE, {
    update(cache, { data: { addMovie } }) {
      const { movies } = cache.readQuery({ query: MOVIES })
      cache.writeQuery({
        query: MOVIES,
        data: { movies: movies.concat([addMovie]) }
      })
    }
  })
  const [show, setShow] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState({
    _id: '',
    poster_path: '',
    title: '',
    overview: '',
    tags: []
  })
  const handleClose = () => setShow(false)

  const handleShow = movie => {
    setSelectedMovie(movie)
    setShow(true)
  }

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    update(cache, { data: { deleteMovie } }) {
      const { movies } = cache.readQuery({ query: MOVIES })
      cache.writeQuery({
        query: MOVIES,
        data: { movies: movies.filter(i => i !== deleteMovie._id) }
      })
    }
  })

  const handleDeleteMovie = id => {
    deleteMovie({ variables: { id } })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <Container>
      <CardColumns>
        {data.movies.map(movie => {
          return (
            <Card className="m-3 p-3" key={movie._id}>
              <Card.Img variant="top" src={movie.poster_path} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.overview}</Card.Text>
                <Card.Text>
                  Tags :
                  <small className="text-muted"> {movie.tags.join(', ')}</small>
                </Card.Text>
                <Button variant="primary" onClick={() => handleShow(movie)}>
                  Detail
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteMovie(movie._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          )
        })}
      </CardColumns>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Movie Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="m-3 p-3" key={selectedMovie._id}>
            <Card.Img variant="top" src={selectedMovie.poster_path} />
            <Card.Body>
              <Card.Title>{selectedMovie.title}</Card.Title>
              <Card.Text>{selectedMovie.overview}</Card.Text>
              <Card.Text>
                Tags :
                <small className="text-muted">
                  {selectedMovie.tags.join(', ')}
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>Add Movie</h1>
      <Form onSubmit={handleOnSubmitMovie}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            onChange={event => setTitle(event.target.value)}
            value={title}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Overview</Form.Label>
          <Form.Control
            type="text"
            onChange={event => setOverview(event.target.value)}
            value={overview}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Poster Path</Form.Label>
          <Form.Control
            type="text"
            onChange={event => setPosterpath(event.target.value)}
            value={poster_path}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Popularity</Form.Label>
          <Form.Control
            type="number"
            onChange={event => setPopularity(Number(event.target.value))}
            value={popularity}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            onChange={event => setTags(event.target.value.split(','))}
            value={tags.join(',')}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
