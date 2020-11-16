import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import Router from "next/router"

import styles from '../styles/Auth.module.scss'

//redirect from here to / if logged in
//sign up - re-enter password, email that activates account and only then adds account
    //user object indicates if active or not
    //rando key for account must be given to activate->if matches, creates for real
//cssgrid calender - journal view?
const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [submitFail,setSubmitFail] = useState(false)
    const [reg, setReg] = useState(false)

    const switchStates = () => {
        setUsername("")
        setPassword("")
        setSubmitFail(false)
        setReg(!reg)
    }

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitFail(false)
        if (!username || !password) {
            setSubmitFail(true)
            return
        }
        try {
            const response = await fetch('/api/login', { //response has a cookie with jwt in 'auth'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            })
            let user = await response.text()
            console.log('~~~ response.text', user)

            if (!user)
            {
                setSubmitFail(true)
                return
            }
            Router.push({
                pathname: '/',
                query: { user },
            })
            /* Do this via a get home page api instead to make it less ugly?*/
            /*const url = "http://localhost:3000/"
            return await fetch('/api/reroute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url
                })
            })*/
        }
        catch (error) {
            console.log(error)
        }
        return
    }

    const handleRegSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitFail(false)
        if (!username || !password) {
            setSubmitFail(true)
            return
        }
        try {
            console.log("PASSWORD: " + password)
            const response = await fetch('/api/reg', { //response has a cookie with jwt in 'auth'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            })
            
            let user = await response.text()

            Router.push({
                pathname: '/',
                query: { user },
            }) //jwt header will have username to draw from
        }
        catch (error) {
            console.log(error)
        }
        return
    }

    return (
        <div className={styles.split}>
            <div className={styles.left}>
                <h1 className={styles.title}>MOOD FOR YOU</h1>
                <h2 className={styles.subtitle}>~an automatic mood tracker and journaling application~</h2>
            </div>
            <div className={styles.right}>
                <div className={styles.box}>
                    {!reg &&
                        <>
                        <h1 className={styles.header}>
                            <span className={styles.h1on}>Log In</span>
                            <span className={styles.or}>or</span>
                            <span>
                                <button className={styles.h1off} onClick={switchStates}>Sign Up</button>
                            </span>
                        </h1>
                        {submitFail && (
                            <div className={styles.error}>Username-password combination doesn't match our records.</div>
                        )}
                        <AuthForm onSubmit={handleLoginSubmit} setUser={setUsername} setPass={setPassword} buttonText="Log In"/>
                        </>
                    }

                    {reg &&
                        <>
                        <h1 className={styles.header}>
                            <span>
                                <button className={styles.h1off} onClick={switchStates}>Log In</button>
                            </span>
                            <span className={styles.or}>or</span>
                            <span className={styles.h1on}>Sign Up</span>
                        </h1>           
                        {submitFail && (
                            <div className={styles.error}>Username-password combination is not valid.</div>
                        )}            
                        <AuthForm onSubmit={handleRegSubmit} setUser={setUsername} setPass={setPassword} buttonText="Sign Up"/>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Login
