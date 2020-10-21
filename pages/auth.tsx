import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import Router from "next/router"

//redirect from here to / if logged in
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
            await fetch('/api/reg', { //response has a cookie with jwt in 'auth'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            })
            /*
            let user = await response.text()
            if (user) {
                setRegFail(true)
            }*/

            Router.push('/') //jwt header will have username to draw from
        }
        catch (error) {
            console.log(error)
        }
        return
    }

    return (
        <>
            {!reg &&
                <>
                <h1>Login</h1>
                <AuthForm onSubmit={handleLoginSubmit} setUser={setUsername} setPass={setPassword} buttonText="Login"/>
                {submitFail && (
                    <p>Login failed! Try again.</p>
                )}
                <button onClick={switchStates}>Don't have an account? Register now.</button>
                </>
            }

           {reg &&
                <>
                <h1>Register</h1>
                <AuthForm onSubmit={handleRegSubmit} setUser={setUsername} setPass={setPassword} buttonText="Register"/>
                {submitFail && (
                    <p>Registration failed! Try again.</p>
                )}
                <button onClick={switchStates}>Already have an account? Login now.</button>
                </>
            }
        </>
    )
}

export default Login
