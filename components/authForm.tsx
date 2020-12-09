import React from 'react'
import styles from '../styles/Auth.module.scss'
/*
* TODO: eye icon to replace type so as to view password
*/

//The component used for both the registration and login view.
export const AuthForm = (props: { onSubmit: ((event: React.FormEvent<HTMLFormElement>) => void), 
    setUser: React.Dispatch<React.SetStateAction<string>>, 
    setPass: React.Dispatch<React.SetStateAction<string>>,
    buttonText: string}) => {

    let maxLength = 255

    return (
        <>
            <form onSubmit={props.onSubmit}>
                <div className={styles.form}>
                    <label>Username</label>
                    <input className={styles.input} type="text" name="Username" placeholder="Username" maxLength={maxLength} onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setUser(event.currentTarget.value)}} />
                    <label>Password</label>
                    <input className={styles.input} type="password" name="Password" placeholder="Password" maxLength={maxLength} onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setPass(event.currentTarget.value)}}/>
                </div>
                <button className={styles.button} type="submit">{props.buttonText}</button>
            </form>
        </>
    )
}