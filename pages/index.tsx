import { NextPageContext } from 'next'
import Router from 'next/router'
import {useState} from 'react'
import React, {useEffect} from 'react'
import {Line, Pie, ChartData} from 'react-chartjs-2'

import styles from '../styles/Home.module.scss'
import {journalEntry} from '../utils/journals'
import {Payload} from '../utils/cookie'

/* TODO:
* Better define "magic numbers" and weird 42 math
* Throw errors with new Error(string)
* await fetch can be done in try catch with response = await promise...if promise rejects, doesn't throw an error until u await it
*/

interface Display {
  user:Payload,
  entries:journalEntry[]
}

const Home = (data:Display) => {
  //States for calender and journal management.
  const [entry, setEntry] = useState('')
  const [entries, setEntries] = useState(data.entries)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(new Date(year,month,1).getDay())
  const [endDay, setEndDay] = useState(new Date(year, month+1, 0).getDate())
  const [mood, setMood] = useState('')
  const [moodStyle,setMoodStyle] = useState('')

  //States for general DOM manipulation.
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntry,setShowEntry] = useState(false)
  const [submitWin, setSubmitWin] = useState(false)
  const [showChart,setShowChart] = useState(false)
  const [line, setLine] = useState(false)

  //If the user has opened a new tab with this application, display a welcome screen before removing it from DOM.
  useEffect(() => {
    if (window.sessionStorage.length === 0) {
      window.sessionStorage.setItem('welcome', 'true')
    }
    if (window.sessionStorage.getItem('welcome') === 'true') {
      let screen = document.getElementById('removeFromDOM')
      if (screen === null) return
      screen!.style.visibility="visible"
      //screen!.style.visibility="hidden"
      
      setTimeout(function() {
        //screen.childNodes[0] != null && screen.removeChild(screen.childNodes[0])
        screen!.style.visibility="hidden"
      }, 4000);
      sessionStorage.setItem('welcome','false')
    }
    else {
      /*
      let welcome = document.getElementById('removeFromDOM')
      if(welcome === null) return
      welcome.style.display ="none"
      */
      /*
      if (welcome !=null && welcome.childNodes[0] != null) {
        welcome.removeChild(welcome.childNodes[0])
        welcome.className = 'goodbye'
      }*/
    }
  }, []);

  //Adjust chart font size according to screen size
  const getChartFontSize = ():number => {
    if (screen.width >= 1300 ) {
      return 40;
    }
    else {
      return 20;
    }

  }

  //Adjust line chart point size according to screen size
  const getChartDotSize = ():number => {
    if (screen.width >= 1300 ) {
      return 7;
    }
    else {
      return 3;
    }
  }

  //Fill out line and pie charts
  const getChartData = (type:string):ChartData<any> => {
    let posCount:number = 0
    let negCount:number = 0
    let neutralCount:number = 0
    let fluidMoods:number[] = []
    let colorMoods:(string | null)[] = []
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
              pointRadius: getChartDotSize()
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

  //Load the journal entry upon clicking its circle indicator and assign it a mood.
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

  //Change the month upon pressing the arrows on screen and retrieve that months' entries from the database.
  const changeMonth = async (dir:number) => {
    let newDate
    let newMonth
    let newYear = year
    if (dir < 0)
    {
      if (month-1 < 0)
      {
        newMonth = 11
        newYear = year-1
        newDate = new Date(year-1, 11, 1)
      }
      else {
        newMonth = month-1
        newDate = new Date(year, month-1, 1)
      }
    }
    else 
    {
      if (month+1 > 11)
      {
        newMonth = 0
        newYear = year+1
        newDate = new Date(year+1, 0, 1)
      }
      else { 
        newMonth = month+1
        newDate = new Date(year, month+1, 1)
      }
    }
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
    let tempEntries = await response?.json() ?? []
    console.log("NEW ENTRIES: " , tempEntries)
    setEntries(tempEntries.entries)
    setStartDay(newDate.getDay())
    setEndDay(new Date(newYear,newMonth+1,0).getDate())
    setMonth(newMonth)
    setYear(newYear)
    return
  }

  //Logout and destroy cookie
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

  //Submit a new journal entry
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
    Router.replace('/') //Refresh to show changes
    return
  }

  return (
    <>
      <div id="removeFromDOM" className={styles.welcome}><div className={styles.message}>Welcome back, {data.user.username}</div></div>
      <div className={styles.screen}>
      <div className={styles.menu}>
        <div className = {styles.iconContainer}>
          <img className={styles.iconLeft} onClick={()=>changeMonth(-1)} src="/static/images/straight-left-arrow.svg"/>
          <img className={styles.iconRight} onClick={()=>changeMonth(1)} src="/static/images/straight-right-arrow.svg"/>
          <img className={styles.iconLeft} onClick={()=>setShowChart(true)} src="/static/images/pie-chart.svg"/>
          <img className={styles.iconRight} onClick={logout} src="/static/images/on-off-button.svg" />
        </div>
        {/*Desktop icon styling*/}
        <img className={styles.iconCenter} onClick={()=>setShowChart(true)} src="/static/images/pie-chart.svg"/>
        <img className={styles.iconCenter} onClick={logout} src="/static/images/on-off-button.svg" />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          {`${['January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${year}`}
        </div>
        {/*Adjust number of rows in calender for any months that start later in the week*/}
        <div className={((startDay==5 && endDay>30) || (startDay==6 && endDay >=30)) ? styles.calenderSpecial : styles.calender}>
          <div className={styles.daysContainer}>
            {['Su','M','Tu','W','Th','F','Sa'].map((day) => {
              return (
                <span key={day} className={styles.daysWeek}>{day}</span>
            )})}
          </div>
          {[...Array(42)].map((day, index) => {
            //For each cell of the calender...
            let calNum = index+1 - startDay
            //If the current index is before the month has started, leave the cell blank.
            if (index < startDay) {
              return (
                <div key={index} className={styles.cell}>
                </div>
              )
            }
            //If this cell is "today"
            if (calNum === new Date().getDate() && month===new Date().getMonth() && year==new Date().getFullYear()) {
              console.log('index: ' + index)
              //Check if the corresponding journal entry empty. If it is, prompt the user to add a new entry by changing the style
              let today:string = entries?.[index]?.entry ?? ''
              if (today==='') {
                return (
                  <div key={index} className={styles.today}>
                    <div className={styles.dateNumToday}>{calNum}</div>
                    <div className={styles.circleToday} onClick={() => {setSubmitWin(true)}}>?</div>
                  </div>
                )
              }
            } 
            //Do not populate the extra rows for long months at all if it's not a long month.
            if (!((startDay==5 && endDay>30) || (startDay==6 && endDay >=30)) && index>=35) return null
            let circleStyle
            //Assign circle style according to mood of given entry
            if (entries[index] != null) {
              if (entries[index].mood < -2) circleStyle = `${styles.circle} ${styles.sad}`
              else if (entries[index].mood > 2) circleStyle = `${styles.circle} ${styles.happy}`
              else circleStyle = styles.circle
            }
            
            //Standard calender cell styling
            return (
              <div key={index} className={styles.cell}> 
              
                {(calNum) <= endDay && 
                  <div className={styles.dateNum} onClick={getEntry}>{calNum}</div>}
                {entries[index] != null &&
                  <div id={`${index}`} className={circleStyle} onClick={getEntry}>
                  </div>
                }
              
              </div>
          )})}
      </div>
      </div>
      {submitWin && (
        <>
        <div className={styles.dim} onClick={() => setSubmitWin(false)}/>
        <div className={styles.exit} onClick={()=> setSubmitWin(false)}>X</div>
        <div className={styles.popUp}>
            <h1 className={styles.submitHeader}>How are you?</h1>
            {submitFail && (
                <div className={styles.failed}>Your journal entry should not be empty!</div>
              )}
            <form className={styles.formContainer} onSubmit={submitJournal}>
              <textarea className={styles.submitBox} onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {setEntry(event.currentTarget.value)}}/>
              <br />
              <button type="submit" className={styles.submitButton}>Submit</button>
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
      )}
      {showChart && (
        <>
        <div className={styles.dim} onClick={() => setShowChart(false)}/>
        <div className={styles.exit} onClick={()=> setShowChart(false)}>X</div>
        <div className={styles.popUp}>
          <h1 className={styles.chartHead}>Moods this Month</h1>
          {line && (<div className={styles.chartLine}>
            <Line
              data={getChartData('line')}
              options={{
                title:{
                  display:false,
                },
                responsive: true, 
                maintainAspectRatio: false,
                legend:{
                  display:true,
                  position:'bottom',
                  labels: {
                    filter: (label) => {
                      if (label.text === 'mood') return false
                      return true
                    },
                    fontSize:getChartFontSize(),
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
                responsive: true, 
                maintainAspectRatio: false,
                legend:{
                  display:true,
                  position:'bottom',
                  labels: {
                    fontSize:getChartFontSize(),
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
      <div className={styles.creditSymbol}>
          <img className={styles.copyright} src="/static/images/copyright.svg"/>
          <div className={styles.credits}>
            <span>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></span>
          </div>
      </div>
      </div>
    </>
  )
}

//Retrieves the journal entries for the month on initial load/reload, the processes of which also authenticates the user by necessity.
//Redirect to /auth if the user is not logged in, but otherwise load up the username, user id, and user's journal entries for the current month.
Home.getInitialProps = async (ctx: NextPageContext) => { 
  console.log("in initial props")
  let infoObject: Display | null = null
  if (ctx.req)
  {
    console.log("in server side")
    await fetch('http://localhost:3000/api/getEntries', {
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
    .then (response => {
      if (response == null || response == undefined || !response.ok) throw "getEntries fetch returned null"
      return response.json()
    }).then((json) => {
      infoObject = json
    }).catch ((error) => {
      console.error(error)
      ctx.res?.writeHead(302, {
        Location: 'http://localhost:3000/auth'
      })
      ctx.res?.end()
      return {}
    })
  }
  else {
    console.log("in else")
    await fetch('http://localhost:3000/api/getEntries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: new Date()
      }),
      credentials: "same-origin"
    })
    .then (response => {
    if (response == null || response == undefined || !response.ok) throw "getEntries fetch returned null"
    return response.json()
    })
    .then((json) => {
      infoObject = json
    })
    .catch ((error) => {
      console.error(error)
      Router.replace('/auth')
      return {}
    })
  }
  if(infoObject == null) return {}
  let entries = infoObject!.entries
  let user = infoObject!.user
  console.log(entries)
  //console.log(entries.filter((entry:journalEntry) => entry != null))
  
  return {user, entries}
}

export default Home
