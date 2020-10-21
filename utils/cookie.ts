import {sign, verify} from 'jsonwebtoken'
import cookie from 'cookie'
import { IncomingMessage } from 'http'
import {ObjectID} from 'mongodb'
import {NextApiRequest} from 'next'

export interface Payload {
    _id: string,
    username: string
}
export const createCookie = async (username:string, userID: ObjectID): Promise<string> => {
    let _id = userID.toHexString()
    console.log("ID: " + _id)
    const jwt = sign({_id, username},`${process.env.JWT_SECRET}`)
    const auth = cookie.serialize('auth',jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        path: '/'
    })
    return auth
}

export const extractFromCookie = async (req: NextApiRequest): Promise<Payload | null> => {
    //const theCookie = cookie.parse(req)
    const token = req.cookies.auth
    console.log("1 token " + token)

    let user: Payload | null
    try {
        user = verify(token, `${process.env.JWT_SECRET}`) as Payload
    }
    catch (error){
        console.log(error)
        user = null
    }
    return user
}

export const extractFromCookie2 = async (req: IncomingMessage): Promise<Payload | null> => {
    console.log("COOKIE 2: " + req.headers.cookie)
    const theCookie = cookie.parse(req.headers.cookie!)
    const token = theCookie.auth
    console.log("2 token " + token)

    let user: Payload | null
    try {
        user = verify(token, `${process.env.JWT_SECRET}`) as Payload
    }
    catch (error){
        console.log(error)
        user = null
    }
    return user
}

export const extractFromCookie3 = async (cookies: string): Promise<Payload | null> => {
    console.log("COOKIE: " + cookies)
    let theCookie: {[key:string]:string}|null= null
    try {
        theCookie = cookie.parse(cookies)
    }
    catch (error) {
        console.log(error)
        let user = null
        return user
    }
    const token = theCookie?.auth
    console.log("2 token " + token)

    let user: Payload | null
    try {
        user = verify(token!, `${process.env.JWT_SECRET}`) as Payload
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
        expires: new Date(98,1),
        path: '/'
    })
    return theCookie
}
