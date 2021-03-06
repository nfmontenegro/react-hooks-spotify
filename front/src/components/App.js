import React, {useState, useEffect} from 'react'
import {Route, withRouter} from 'react-router-dom'

import Artists from './Artists'
import Playlist from './Playlist'
import Category from './Category'
import Categories from './Categories'

import {AppContext} from './Context'
import MenuContainer from '../views/MenuContainer'

import {Button, Wrapper, Title} from '../styled'

function App(props) {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState(false)

  async function getCredentials(event) {
    event.preventDefault()
    setLoading(true)
    const response = await fetch('https://microservice-5ipko1n2e.now.sh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      }
    })
    const json = await response.json()
    localStorage.setItem('token', json.access_token)
    setCredentials(true)
    setLoading(false)
  }

  function logOut() {
    localStorage.clear()
    setCredentials(false)
    props.history.push('/')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    return token ? setCredentials(true) : setCredentials(false)
  }, [credentials])

  return (
    <AppContext.Provider value={{auth: credentials ? true : false}}>
      <Wrapper>
        <Title>Spotify Hooks</Title>
        {!credentials ? (
          <Button onClick={event => getCredentials(event)}>
            {loading ? 'Loading ...' : 'Get Credentials'}
          </Button>
        ) : (
          <>
            <Button onClick={() => logOut()}>Logout</Button>
            <MenuContainer />
          </>
        )}
      </Wrapper>

      <Route path="/artists" component={Artists} />
      <Route path="/categories" component={Categories} />
      <Route path="/playlist/:playlistId" component={Playlist} />
      <Route path="/category/:categoryId" component={Category} />
    </AppContext.Provider>
  )
}

export default withRouter(App)
