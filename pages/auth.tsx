import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import Router from "next/router"

import styles from '../styles/Auth.module.scss'
import { NextPageContext } from 'next'

const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [submitFail,setSubmitFail] = useState(false)
    const [reg, setReg] = useState(false)

    //Reset form elements and page after a failed submission
    const switchStates = () => {
        setUsername("")
        setPassword("")
        setSubmitFail(false)
        setReg(!reg)
    }

    //Log in the user, and notify them of a failed login. If they succeed, reroute them to the home page.
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

            /* Dummy code for possible future rerouting overhaul.
                const url = "http://localhost:3000/"
                return await fetch('/api/reroute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url
                    })
                })
            */
        }
        catch (error) {
            console.log(error)
        }
        Router.push('/')

        return
    }

    //Register the user, and notify them if they're missing any fields. If it's a success, log them in and send them to the home page.
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
            Router.push('/') //jwt header will have username to draw from
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
                    <h1 className={styles.header}>
                        <span className={reg ? styles.h1off : styles.h1on} onClick={reg ? switchStates : undefined}>Log In</span>
                        <span className={styles.or}>or</span>
                        <span className={reg ? styles.h1on : styles.h1off} onClick={reg ? undefined : switchStates}>Sign Up</span>
                    </h1>
                    {submitFail && (
                        <div className={styles.error}>Username-password combination doesn't match our records.</div>
                    )}
                    <AuthForm onSubmit={reg ? handleRegSubmit : handleLoginSubmit} setUser={setUsername} setPass={setPassword} buttonText={reg ? "Sign up" : "Log In"}/>
                </div>
            </div>
        </div>
    )
}

//Determines if the user is logged in. If they are, redirect to the home page. If not, remain here.
Login.getInitialProps = async (ctx: NextPageContext) => {
    if (ctx.req)
        {
            await fetch('http://localhost:3000/api/validate', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': ctx.req.headers.cookie as string
                },
                credentials: "same-origin"
                })
            .then (response => {
                if (response == null || response == undefined || !response.ok) throw "not validated"
                else {
                    ctx.res?.writeHead(302, {
                    Location: 'http://localhost:3000/'
                    })
                    ctx.res?.end()
                }
            }).catch ((error) => {
                console.error(error)
            })
        }
    else {
        await fetch('http://localhost:3000/api/validate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        })
        .then (response => {
            if (response == null || response == undefined || !response.ok) throw "not validated"
            else {
                Router.replace('/')
            }
        })
        .catch ((error) => {
            console.error(error)
        })
    }
    return {}
}

export default Login