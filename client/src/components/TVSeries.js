import React, { useState } from 'react'
import {
  Container,
  Form,
  CardColumns,
  Card,
  Button,
  Modal
} from 'react-bootstrap'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const ADD_TVSERIE = gql`
  mutation addTVSerie(
    $title: String
    $overview: String
    $poster_path: String
    $popularity: Float
    $tags: [String]
  ) {
    addTVSerie(
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

const TVSERIES = gql`
  {
    tvseries {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const DELETE_TVSERIE = gql`
  mutation deleteTVSerie($id: ID) {
    deleteTVSerie(id: $id) {
      _id
      msg
      status
    }
  }
`

export default function TVSeries() {
  const { loading, error, data } = useQuery(TVSERIES)

  const [title, setTitle] = useState('')
  const [overview, setOverview] = useState('')
  const [poster_path, setPosterpath] = useState('')
  const [popularity, setPopularity] = useState('')
  const [tags, setTags] = useState([])

  const handleOnSubmitTVSerie = event => {
    event.preventDefault()
    addTVSerie({
      variables: { title, overview, poster_path, popularity, tags }
    })

    setTitle('')
    setOverview('')
    setPosterpath('')
    setPopularity('')
    setTags([])
  }

  const [addTVSerie] = useMutation(ADD_TVSERIE, {
    update(cache, { data: { addTVSerie } }) {
      const { tvseries } = cache.readQuery({ query: TVSERIES })
      cache.writeQuery({
        query: TVSERIES,
        data: { tvseries: tvseries.concat([addTVSerie]) }
      })
    }
  })
  const [show, setShow] = useState(false)
  const [selectedTVSerie, setSelectedTVSerie] = useState({
    _id: '',
    poster_path: '',
    title: '',
    overview: '',
    tags: []
  })
  const handleClose = () => setShow(false)

  const handleShow = tvserie => {
    setSelectedTVSerie(tvserie)
    setShow(true)
  }

  const [deleteTVSerie] = useMutation(DELETE_TVSERIE, {
    update(cache, { data: { deleteTVSerie } }) {
      const { tvseries } = cache.readQuery({ query: TVSERIES })
      cache.writeQuery({
        query: TVSERIES,
        data: { tvseries: tvseries.filter(i => i !== deleteTVSerie._id) }
      })
    }
  })

  const handleDeleteTVSerie = id => {
    deleteTVSerie({ variables: { id } })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <Container>
      <CardColumns>
        {data.tvseries.map(tvserie => {
          return (
            <Card className="m-3 p-3" key={tvserie._id}>
              <Card.Img variant="top" src={tvserie.poster_path} />
              <Card.Body>
                <Card.Title>{tvserie.title}</Card.Title>
                <Card.Text>{tvserie.overview}</Card.Text>
                <Card.Text>
                  Tags :
                  <small className="text-muted">
                    {' '}
                    {tvserie.tags.join(', ')}
                  </small>
                </Card.Text>
                <Button variant="primary" onClick={() => handleShow(tvserie)}>
                  Detail
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTVSerie(tvserie._id)}
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
          <Modal.Title>TVSerie Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="m-3 p-3" key={selectedTVSerie._id}>
            <Card.Img variant="top" src={selectedTVSerie.poster_path} />
            <Card.Body>
              <Card.Title>{selectedTVSerie.title}</Card.Title>
              <Card.Text>{selectedTVSerie.overview}</Card.Text>
              <Card.Text>
                Tags :
                <small className="text-muted">
                  {selectedTVSerie.tags.join(', ')}
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
      <h1>Add TVSerie</h1>

      <Form onSubmit={handleOnSubmitTVSerie}>
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
