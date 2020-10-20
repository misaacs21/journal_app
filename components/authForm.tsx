import React from 'react'

export const AuthForm = (props: { onSubmit: ((event: React.FormEvent<HTMLFormElement>) => void), 
    setUser: React.Dispatch<React.SetStateAction<string>>, 
    setPass: React.Dispatch<React.SetStateAction<string>>,
    buttonText: string}) => {

    return (
        <>
            <form onSubmit={props.onSubmit}>
                <label>Username
                    <input type="text" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setUser(event.currentTarget.value)}} />
                </label>
                <br/>
                <label>Password
                    <input type="text" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setPass(event.currentTarget.value)}}/>
                </label>
                <br/>
                <button type="submit">{props.buttonText}</button>
            </form>
        </>
    )
}