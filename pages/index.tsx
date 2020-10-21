import { NextPageContext } from 'next'
import {extractFromCookie, extractFromCookie2, extractFromCookie3} from '../utils/cookie'
import Router, { withRouter } from 'next/router'
import {useState} from 'react'
import {Payload} from '../utils/cookie'
import {journalEntry} from '../utils/journals'

interface Display {
  user:Payload,
  entries:journalEntry[]
}
//need error handling for journal entries, what to explain if no entries, etc...
//SWITCH TO NEXT COOKIE SO CAN EASILY GET THEM FROM THE CTX WITHOUT NEEDING A QUERY!
const Home = (data:Display) => {

  const [entry,setEntry] = useState('')
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntries,setShowEntries] = useState(false)

  const logout = async () => {
    try {
      return await fetch('/api/logout', {
        method: 'DELETE',
      }).then(response=> {
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
          {/*Final will have these each in their own calender square correlating to the date they were created -- ADD DATE TO DB. Open in a pop up? only one entry per day. import calender module? view mood trend graph?*/}
          {data.entries.map((entry) => {
            return (
              <>
              <pre white-space='pre-wrap' key={entry._id}>{entry.entry}</pre>
              <p>=================</p>
              {/*to edit entry: add a button that turns the entry display into a textarea w default value of what's already written, then have a 
              save changes button to call an update api route, page must refresh after? also add delete entry w a little symbol too */}
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
    console.log("CLIENT USER" + JSON.stringify(user))
  }

  console.log("HEADERS " + ctx.req?.headers.cookie)


  if (ctx.req) {
    console.log("COOKIE OUT" + ctx.req.headers.cookie)
    user = await extractFromCookie3(ctx.req.headers.cookie!)
    console.log("SERVER USER" + JSON.stringify(user))
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

  if (ctx.req) {
    try {
      response = await fetch('http://localhost:3000/api/getEntries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': ctx.req.headers.cookie as string
        },
        credentials: "same-origin"
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    try {
      response = await fetch('http://localhost:3000/api/getEntries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "same-origin"
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  

  let entries = (response !== null) ? await response.json() : []

  console.log(entries)
  console.log("USER: " + user?.username + " " + user?._id)
  return {user, entries}
}

export default Home
