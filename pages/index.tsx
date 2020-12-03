import { NextPageContext } from 'next'
import {extractFromCookie, extractFromCookie2, extractFromCookie3} from '../utils/cookie'
import Router, { withRouter } from 'next/router'
import {useState} from 'react'
import {Payload} from '../utils/cookie'
import {journalEntry} from '../utils/journals'
import styles from '../styles/Home.module.scss'
import React, {useEffect} from 'react'
import {Line, Pie, ChartData} from 'react-chartjs-2'

interface Display {
  user:Payload,
  entries:journalEntry[]
}
/* HELP:
* Fix stuttery load (elements flashing--welcome, today styling, circles)
* Deployment?
* Fluid mood colors?
*/

/* TODO:
* Style submit fail
* Dates in users timezone
* Redirect to here from auth if user is logged in
*/

const Home = (data:Display) => {
  const [today,setToday] = useState('')
  const [entry, setEntry] = useState('')
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntry,setShowEntry] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(new Date(year,month,1).getDay())
  const [endDay, setEndDay] = useState(new Date(year, month, 0).getDate())
  const [entries, setEntries] = useState(data.entries)
  const [submitWin, setSubmitWin] = useState(false)
  const [mood, setMood] = useState('')
  const [moodStyle,setMoodStyle] = useState('')
  const [showChart,setShowChart] = useState(false)
  const [line, setLine] = useState(false)
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

const getChartData = (type:string):ChartData<any> => {
  let posCount:number = 0
  let negCount:number = 0
  let neutralCount:number = 0
  let fluidMoods:number[] = []
  let colorMoods:(string | null)[] = []
  console.log("going into for each")
  entries.forEach(entry => {
    if (entry == null) {
      fluidMoods.push(Number.NaN)
      colorMoods.push(null)
    }
    else {
      if (entry.mood < -2){
        negCount++
        colorMoods.push('#8ea7bf')
      }
      else if (entry.mood > 2) {
        posCount++
        colorMoods.push('#fff2cc')
      }
      else {
        neutralCount++
        colorMoods.push('#b8b9b9')
      }
      fluidMoods.push(entry.mood)
    }
  })
  if (type == 'pie')
  {
    return (
      {
        labels: ['Positive','Negative','Neutral'],
        datasets: [
          {
            label: 'Mood Counts',
            backgroundColor: ['#fff2cc','#8ea7bf','#b8b9b9'],
            data: [posCount,negCount,neutralCount],
            borderColor: '#647687'
          }
        ]
      }
    )
  }
  let labelList:string[] = []
  for (let i = 1; i<=endDay; i ++) {
    labelList.push(`${i}`)
  }
  return (
      {
        labels: labelList,
        datasets: [
          {
            label: 'mood',
            fill: false,
            lineTension: .5,
            borderColor: '#647687',
            borderWidth: 2,
            data: fluidMoods,
            pointBackgroundColor: colorMoods,
            pointBorderColor: '#647687',
            pointRadius: 7
          },
          {
            label: "Positive",
            backgroundColor: '#fff2cc'
          },
          {
            label: "Neutral",
            backgroundColor: '#b8b9b9'
          },
          {
            label: "Negative",
            backgroundColor: '#8ea7bf'
          }
        ]
      }
    )
}
  const getEntry = (event: React.MouseEvent) => {
    let index:number = parseInt(event.currentTarget.id)
    let temp = entries[index]
    setShowEntry(true)
    setEntry(temp.entry)
    if (temp.mood < -2) {
      setMood('negative')
      setMoodStyle(styles.sad)
    }
    else if (temp.mood > 2) {
      setMood('positive')
      setMoodStyle(styles.happy)
    }
    else {
      setMood('neutral')
      setMoodStyle('')
    }
  }
  
  const changeMonth = async (dir:number) => {
    let newDate
    if (dir < 0)
    {
      if (month-1 < 0)
      {
        setMonth(11)
        setYear(year-1)
        newDate = new Date(year-1, 11, 1)
      }
      else {
      setMonth(month-1)
      newDate = new Date(year, month-1, 1)
      }
    }
    else 
    {
      if (month+1 > 11)
      {
        setMonth(0)
        setYear(year+1)
        newDate = new Date(year+1, 0, 1)
      }
      else { 
      setMonth(month+1)
      newDate = new Date(year, month+1, 1)
      }
    }
    console.log("new date" + newDate)
    setStartDay(newDate.getDay())
    let response
    try {
      response = await fetch('http://localhost:3000/api/getEntries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: newDate,
      })
      })
    }
    catch (error) {
      console.error(error)
    }
    let tempEntries = (response !== null && response !== undefined) ? await response.json() : []
    setEntries(tempEntries)
    return
  }

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
      <div className={styles.menu}>
          <img className={styles.navigationLeft} onClick={()=>changeMonth(-1)} src="/static/images/straight-left-arrow.svg"/>
          <img className={styles.navigationRight} onClick={()=>changeMonth(1)} src="/static/images/straight-right-arrow.svg"/>
          <img className={styles.icon} onClick={()=>setShowChart(true)} src="/static/images/pie-chart.svg"/>
          <img className={styles.icon} onClick={logout} src="/static/images/on-off-button.svg" />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          {`${['January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${year}`}
        </div>
        <div className={((startDay==5 && endDay>30) || (startDay==6 && endDay >=30)) ? styles.calenderSpecial : styles.calender}>
          <div className={styles.daysContainer}>
            {['Su','M','Tu','W','Th','F','Sa'].map((day) => {
              return (
                <span className={styles.daysWeek}>{day}</span>
            )})}
          </div>
          {[...Array(42)].map((day, index) => {
            let calNum = index+1 - startDay
            if (index < startDay) {
              return (
                <div className={styles.cell}>
                </div>
              )
            }
            else if (calNum === new Date().getDate() && month===new Date().getMonth()) {
              let today:string = entries[index] !== null ? entries[index].entry : ''
              if (today=='') { //no today, check month/year and get from array
                return (
                  //onClick change state so pop up with this entry, using calNum as index, since it's assumed in this section of code that month and year
                  //will correspond to what's in data.entries
                  //but how will this play with calender view ie a scroll of multiple months? or chart view
                  <div className={styles.today}>
                    <div className={styles.dateNumToday}>{calNum}</div>
                    <div className={styles.circleToday} onClick={() => {setSubmitWin(true)}}>?</div>
                    
                  </div>
                )
              }
            } //calc END DAY to avoid having to do this new Date() calc constantly?
            if (!((startDay==5 && endDay>30) || (startDay==6 && endDay >=30)) && index>=35) return null
            let circleStyle
            if (entries[index] != null) {
              if (entries[index].mood < -2) circleStyle = `${styles.circle} ${styles.sad}`
              else if (entries[index].mood > 2) circleStyle = `${styles.circle} ${styles.happy}`
              else circleStyle = styles.circle
            }
            
            return (
              <div className={styles.cell}> 
                {(calNum) <= endDay && 
                  <div className={styles.dateNum} onClick={getEntry}>{calNum}</div>}
                {entries[index] != null &&
                  <div id={`${index}`} className={circleStyle} onClick={getEntry}>
                  </div>
                }
              </div>
              //DoES THIS LOGIC HOLD??? GETS LAST DAY OF PREVIOUS MONTH?
          )})}
         
          {/*<button onClick={()=>setShowEntries(!showEntries)}>Show/hide journal entries</button>*/}
        </div>
      </div>
      {submitWin && (
        <>
        <div className={styles.dim} onClick={() => setSubmitWin(false)}/>
        <div className={styles.exit} onClick={()=> setSubmitWin(false)}>X</div>
        <div className={styles.popUp}>
            <h1 className={styles.submitHeader}>How are you?</h1>
            <form className={styles.formContainer} onSubmit={submitJournal}>
              <textarea className={styles.submitBox} onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {setEntry(event.currentTarget.value)}}/>
              <br />
              <button type="submit" className={styles.submitButton}>Submit</button>
              {submitFail && (
                <p>Your journal entry should not be empty!</p>
              )}
            </form>
        </div>
        </>
      )}
      {showEntry && (
        <>
        <div className={styles.dim} onClick={() => setShowEntry(false)}/>
        <div className={styles.exit} onClick={()=> setShowEntry(false)}>X</div>
        <div className={styles.popUp}>
          <h1 className={`${styles.journalLabel} ${moodStyle}`}>Today was {mood}</h1>
          <div className={styles.readBox}>
              {entry}
          </div>
        </div>
        </>
        //how do i put normal code in
      )}
      {showChart && (
        <>
        <div className={styles.dim} onClick={() => setShowChart(false)}/>
        <div className={styles.exit} onClick={()=> setShowChart(false)}>X</div>
        <div className={styles.popUp}>
          <h1 className={styles.chartHead}>Moods this Month</h1>
          {line && (<div className={styles.chart}>
            <Line
              data={getChartData('line')}
              options={{
                title:{
                  display:false,
                },
                legend:{
                  display:true,
                  position:'bottom',
                  labels: {
                    filter: (label) => {
                      if (label.text === 'mood') return false
                      return true
                    },
                    fontSize:40,
                    fontFamily: 'Georgia, sans-serif',
                    fontColor: '#647687',
                    padding:20,
                    boxWidth: 50
                  }
                },
                spanGaps: true,
                scales: {
                  yAxes: [{
                      display: true,
                      ticks: {
                          suggestedMin: -5,
                          suggestedMax: 5
                      }
                  }]
                }
              }}
            />
          </div>)}
          {!line && (<div className={styles.chart}>
            <Pie
              data={getChartData('pie')}
              options={{
                title:{
                  display:false
                },
                legend:{
                  display:true,
                  position:'bottom',
                  labels: {
                    fontSize:40,
                    fontFamily: 'Georgia, sans-serif',
                    fontColor: '#647687',
                    padding:20,
                    boxWidth: 50
                  }
                },
              }}
            />
          </div>)}
          <div className={styles.toggle}>
            <span className={line ? styles.h1off : styles.h1on} onClick={() => setLine(false)}>Percentage</span>
            <span className={styles.or}>or</span>
            <span className={line ? styles.h1on : styles.h1off} onClick={() => setLine(true)}>Over Time</span>
          </div>
        </div>
        </>
      )}
      {/*<button onClick={logout}>Logout</button>*/}
      {/*<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/}
      </div>
    </>
  )
}

Home.getInitialProps = async (ctx: NextPageContext) => { //QUESTION: only activates server-side, but I have to route from login to here on client-side
  //console.log("in initial props")
  let user: Payload | null = null
  if (ctx.query.user) {
    user = JSON.parse(Array.isArray(ctx.query.user) ? ctx.query.user[ 0 ] : ctx.query.user)
    //console.log("CLIENT USER" + JSON.stringify(user))
  }
 // console.log("HEADERS " + ctx.req?.headers.cookie)


  if (ctx.req) {
    //console.log("COOKIE OUT" + ctx.req.headers.cookie)
    user = await extractFromCookie3(ctx.req.headers.cookie!)
    //console.log("SERVER USER" + JSON.stringify(user))
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': ctx.req.headers.cookie as string
        },
        body: JSON.stringify({
          date: new Date()
        }),
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date()
        }),
        credentials: "same-origin"
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  let entries = (response !== null && response !== undefined) ? await response.json() : []

  console.log(entries.filter((entry:journalEntry) => entry != null))
  console.log("USER: " + user?.username + " " + user?._id)

  return {user, entries}
}

export default Home
