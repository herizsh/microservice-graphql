import React from 'react'
import Header from './components/Header'
import Movies from './components/Movies'

import { Switch, Route } from 'react-router-dom'
import TVSeries from './components/TVSeries'

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/" exact>
          <Movies />
        </Route>
        <Route path="/tvseries">
          <TVSeries />
        </Route>
      </Switch>
    </div>
  )
}

export default App
