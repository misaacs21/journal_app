import { NextPageContext } from 'next'
import {extractFromCookie} from '../utils/cookie'
import Router, { withRouter } from 'next/router'
import {useState} from 'react'
import {Payload} from '../utils/cookie'
import {journalEntry} from '../utils/journals'

interface Display {
  user:Payload,
  entries:journalEntry[]
}
//need error handling for journal entries, what to explain if no entries, etc...
const Home = (data:Display) => {

  const [entry,setEntry] = useState('')
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntries,setShowEntries] = useState(false)

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

  const submitJournal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitFail(false)
    if (entry == '') {
      setSubmitFail(true)
      return
    }
    try {
      console.log("MORE ID: " + data.user._id)
      const userID = data.user._id
      return await fetch('/api/submitEntry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entry,
            userID //don't need this
        }),
      })
    }
    catch (error) {
      console.log(error)
    }

  }

  //QUESTION: why can't I put anything in here?
  return (
    <div>
      <h1>Welcome back, {data.user.username}   <button onClick={logout}>Logout</button></h1>
      <p/>
      <form onSubmit={submitJournal}>
        <textarea onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {setEntry(event.currentTarget.value)}}/>
        <br />
        <button type="submit">Submit</button>
        {submitFail && (
          <p>Your journal entry should not be empty!</p>
        )}
      </form>
      <button onClick={()=>setShowEntries(!showEntries)}>Show/hide journal entries</button>
      {showEntries && (
        <div>
          {data.entries.map((entry) => {
            return (
              <>
              <pre white-space='pre-wrap' key={entry._id}>{entry.entry}</pre>
              <p>=================</p>
              </>
            )
          })}
        </div>
      )}
    </div>
  )
}

Home.getInitialProps = async (ctx: NextPageContext) => { //QUESTION: only activates server-side, but I have to route from login to here on client-side
  let user: Payload | null = null

  if (ctx.query.user) {
    user = JSON.parse(Array.isArray(ctx.query.user) ? ctx.query.user[ 0 ] : ctx.query.user)
  }

  if (ctx.req) {
    user = await extractFromCookie(ctx.req)
  }

  if (!user && !ctx.req) {
    Router.replace('/auth')
    return {}
  }
  else if (!user && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: 'http://localhost:3000/auth'
    })
    ctx.res?.end()
    return {}
  }
  const userID = user?._id
  let response: Response | null = null
  try {
    debugger

    response = await fetch('http://localhost:3000/api/getEntries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "same-origin"
    })

    console.log({ body: await response.text()})

  }
  catch (error) {
    console.error(error)
  }

  // let entries = (response !== null) ? await response.json() : []

  // console.log(entries)
  console.log("USER: " + user?.username + " " + user?._id)
  return {user, entries : []}
}

export default Home
