import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import Router from "next/router"
import {User} from '../utils/user'

const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [loginFail,setLoginFail] = useState(false)
    const [regFail, setRegFail] = useState(false)

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoginFail(false)
        try {
            const response = await fetch('/api/login', {
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
                setLoginFail(true)
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
        setRegFail(false)
        try {
            const response = await fetch('/api/reg', {
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
    
            if (user) {
                setRegFail(true)
            }
            Router.push('/') //jwt header will have username to draw from
        }
        catch (error) {
            console.log(error)
        }
        return
    }

    return (
        <>
            <h1>Login</h1>
            <AuthForm onSubmit={handleLoginSubmit} setUser={setUsername} setPass={setPassword} buttonText="Login"/>
            {loginFail && (
                <p>Login failed! Try again.</p>
            )}
           <h1>Don't have an account? Register now.</h1>
           <AuthForm onSubmit={handleRegSubmit} setUser={setUsername} setPass={setPassword} buttonText="Register"/>
           {regFail && (
               <p>User already exists! Login?</p>
           )}
        </>
    )
}

export default Login