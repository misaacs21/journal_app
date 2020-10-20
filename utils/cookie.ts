import {sign, verify} from 'jsonwebtoken'
import cookie from 'cookie'
import { IncomingMessage } from 'http'

export const createCookie = async (username:string): Promise<string> => {
    const jwt = sign({user:username},`${process.env.JWT_SECRET}`)
    const auth = cookie.serialize('auth',jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        path: '/'
    })
    return auth
}

export const extractFromCookie = async (req:IncomingMessage): Promise<string | null> => {
    const theCookie = cookie.parse(req.headers.cookie || '')
    const token = theCookie.auth
    console.log("token " + token)

    let user: any
    try {
        user= verify(token, `${process.env.JWT_SECRET}`)
        user = user.user
    }
    catch (error){
        console.log(error)
        user = null
    }
    return user
}

export const destroyCookie = async (): Promise<string> => { 
    const theCookie = cookie.serialize('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        path: '/'
    })
    return theCookie
}