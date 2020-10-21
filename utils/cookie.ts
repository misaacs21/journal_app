import {sign, verify} from 'jsonwebtoken'
import cookie from 'cookie'
import { IncomingMessage } from 'http'
import {ObjectID} from 'mongodb'

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

export const extractFromCookie = async (req:IncomingMessage): Promise<Payload | null> => {
    const theCookie = cookie.parse(req.headers.cookie || '')
    const token = theCookie.auth
    console.log("token " + token)

    const { headers } = req


    console.log({ headers })

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

export const destroyCookie = async (): Promise<string> => {
    const theCookie = cookie.serialize('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        path: '/'
    })
    return theCookie
}
