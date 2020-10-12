import React, {useState}  from 'react'
import {AuthForm} from '../components/authForm'
import {checkAuthentication} from '../utils/user'
import Router from "next/router"

const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [attemptFail,setattemptFail] = useState(false)

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setattemptFail(false)
        try {
            const user = await checkAuthentication(username,password)
    
            if (user === null) {
                console.log("here!")
                setattemptFail(true)
                return
            }
            //Router.replace('/')
        }
        catch (error) {
            console.log(error)
        }
        return
    }
    const handleRegSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const user = await checkAuthentication(username,password)
    
            if (user) {
                //redirect to login somehow
            }
            //call user.ts create user function
        }
        catch (error) {
            console.log(error)
        }
        return
    }

    return (
        <>
            <AuthForm onSubmit={handleLoginSubmit} setUser={setUsername} setPass={setPassword} buttonText="Login"/>
            {attemptFail && (
            <p>Login failed! Try again.</p>
            )}
           <h1>Register (in split pane)</h1>
           <h2>Don't have an account? Register now. [same page or separate page]?</h2>
        </>
    )
}

export default Login