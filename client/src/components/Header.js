import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand to="/" as={Link}>
            Entertain Me
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link to="/" as={Link}>
              Home
            </Nav.Link>
            <Nav.Link to="/tvseries" as={Link}>
              TVSeries
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}
