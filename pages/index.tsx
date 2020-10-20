import { NextPageContext } from 'next'
import {extractFromCookie} from '../utils/cookie'
import Router from 'next/router'

const Home = ({username}:any) => {
  return (
    <div>
      <h1>Welcome back, {username}</h1> 
      <button onClick={logout}>Logout</button>
    </div>
  )
}

const logout = async () => {
  try {
    return await fetch('/api/logout', {
      method: 'DELETE',
    }).then(response=> {
      console.log(response)
      Router.replace('/auth')
    })
  }
  catch (error) {
    console.log(error)
    return
  }
}


Home.getInitialProps = async (ctx: NextPageContext) => { //only activates server-side, but I have to route from login to here on client-side
  let user: string|null = null
  if (ctx.req) {
    user = await extractFromCookie(ctx.req)
  }
  if (!user && !ctx.req) {
    Router.replace('/auth')
    return
  }
  else if (!user && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: 'http://localhost:3000/auth'
    })
    ctx.res?.end()
    return
  }
  console.log("USER: " + user)
  return {username: user} //Why can't I just have this be "user" and the value passed in be just "username", no brackets?
}

export default Home
