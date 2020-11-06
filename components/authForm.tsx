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
                    <label className={styles.h2}>Username</label>
                    <br/>
                    <input className={styles.input} type="text" name="Username" placeholder="Username" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setUser(event.currentTarget.value)}} />
                    <br/>
                    <label className={styles.h2}>Password</label>
                    <br/>
                    <input className={styles.input} type="text" name="Password" placeholder="Password" onChange={(event:React.ChangeEvent<HTMLInputElement>) => {props.setPass(event.currentTarget.value)}}/>
                    <br/>
                </div>
                <button className={styles.button} type="submit">
                    <h2 className={styles.h2}>{props.buttonText}</h2>
                </button>
            </form>
        </>
    )
}