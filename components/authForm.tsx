import React, {useState} from 'react'

export const AuthForm = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(`${username} and ${password}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Username
                <input type="text" value={username} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setUsername(event.currentTarget.value)} />
            </label>
            <br/>
            <label>Password
                <input type="text"  value={password} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)}/>
            </label>
            <br/>
            <button type="submit">Login</button>
        </form>
    )
}