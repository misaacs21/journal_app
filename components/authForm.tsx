import React from 'react'
import styles from '../styles/Auth.module.scss'

export const AuthForm = (props: { onSubmit: ((event: React.FormEvent<HTMLFormElement>) => void), 
    setUser: React.Dispatch<React.SetStateAction<string>>, 
    setPass: React.Dispatch<React.SetStateAction<string>>,
    buttonText: string}) => {

    return (
        <>
            <form onSubmit={props.onSubmit}>
                <div className={styles.form}>
                    <label>Username</label>
                    <input className={styles.input} type="text" name="Username" placeholder="Username" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setUser(event.currentTarget.value)}} />
                    <label>Password</label>
                    <input className={styles.input} type="password" name="Password" placeholder="Password" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setPass(event.currentTarget.value)}}/>
                    {/*Add eye icon that onclick replaces type */}
                </div>
                <button className={styles.button} type="submit">{props.buttonText}</button>
            </form>
        </>
    )
}