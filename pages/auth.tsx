import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import Router from "next/router"
import {User} from '../utils/user'


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
            const response = await fetch('/api/login', { //returns user with jwt field if successful
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
            console.log('username: ', JSON.parse(user).username) //this will be in jwt, don't worry, can easily get from jwt in home page
            Router.push('/')
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
            await fetch('/api/reg', { //returns token string if successful
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