import { NextPageContext } from 'next'
import {extractFromCookie, extractFromCookie2, extractFromCookie3} from '../utils/cookie'
import Router, { withRouter } from 'next/router'
import {useState} from 'react'
import {Payload} from '../utils/cookie'
import {journalEntry} from '../utils/journals'
import styles from '../styles/Home.module.scss'
import React, {useEffect} from 'react'

interface Display {
  user:Payload,
  entries:journalEntry[]
}
//need error handling for journal entries, what to explain if no entries, etc...
//ADD NEXT COOKIE SO CAN EASILY GET THEM FROM THE CTX WITHOUT NEEDING A QUERY!
//why is startday1 after recompile, not 0?

//should journal entries be in a state variable or something? Access them month to month?
const Home = (data:Display) => {
  const [entry,setEntry] = useState('')
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntries,setShowEntries] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(new Date(year,month,1).getDay())
  //journal entry state

  useEffect(() => {
    //do journal entry call here
    if (window.sessionStorage.length === 0) {
      window.sessionStorage.setItem('welcome', 'true')
    }
    if (window.sessionStorage.getItem('welcome') === 'true') {
      setTimeout(function() {
        let screen = document.getElementById('removeFromDOM')
        if (screen === null)
        {
          return
        }
        screen.childNodes[0] != null && screen.removeChild(screen.childNodes[0])
        screen!.className = 'goodbye'
      }, 4000);
      sessionStorage.setItem('welcome','false')
    }
    else {
      let welcome = document.getElementById('removeFromDOM')
      if (welcome !=null && welcome.childNodes[0] != null) {
        welcome.removeChild(welcome.childNodes[0])
        welcome.className = 'goodbye'
      }
    }
  }, []);

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
    //event.preventDefault()
    setSubmitFail(false)
    if (entry == '') {
      event.preventDefault()
      setSubmitFail(true) //refreshes the page after this bc event.preventdefault()...
      return
    }
    try {
      console.log("MORE ID: " + data.user._id)
      const userID = data.user._id
      let date = new Date()
      return await fetch('/api/submitEntry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entry,
            userID,
            date
        }),
      })
    }
    catch (error) {
      console.log(error)
    }
    Router.replace('/')
    //window.location.reload()
    return
  }

  return (
    <>
      <div id="removeFromDOM" className={styles.welcome}><div className={styles.message}>Welcome back, {data.user.username}</div></div>
      <div className={styles.screen}>
      <div className={styles.menu}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          {`${['January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${year}`}
        </div>
        <div className={styles.calender}>
          <div className={styles.daysContainer}>
            {['Su','M','Tu','W','Th','F','Sa'].map((day) => {
              return (
                <span className={styles.daysWeek}>{day}</span>
            )})}
          </div>
          {[...Array(35)].map((day, index) => {
            if (index < startDay) {
              return (
                <div className={styles.cell}>
                </div>
              )
            }
            return (
              /*today && the special style*/
              <div className={styles.cell}>
                {(index+1-startDay) < new Date(year, month, 0).getDate() && 
                <div className={styles.dateNum}>{index+1-startDay}</div>}
                {/*journal entry for index+1-startDay && dot */}
              </div>
          )})}
          {/*<form onSubmit={submitJournal}>
            <textarea onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {setEntry(event.currentTarget.value)}}/>
            <br />
            <button type="submit">Submit</button>
            {submitFail && (
              <p>Your journal entry should not be empty!</p>
            )}
            </form>*/}
          {/*<button onClick={()=>setShowEntries(!showEntries)}>Show/hide journal entries</button>*/}
        </div>
      </div>
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
      {/*<button onClick={logout}>Logout</button>*/}
      </div>
    </>
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
