import {sign, verify} from 'jsonwebtoken'
import cookie from 'cookie'
import { IncomingMessage } from 'http'
import {ObjectID} from 'mongodb'
import {NextApiRequest} from 'next'

export interface Payload {
    _id: string,
    username: string
}

//Create a cookie with JWT inside.
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

//Extract payload from the cookie server-side.
export const extractFromCookieRequest = async (req: NextApiRequest): Promise<Payload | null> => {
    const token = req.cookies.auth

    let user: Payload | null
    try {
        user = verify(token, `${process.env.JWT_SECRET}`) as Payload
    }
    catch (error){
        user = null
    }
    return user
}

//Extract payload from the cookie client-side.
export const extractFromCookieIncomingMsg = async (req: IncomingMessage): Promise<Payload | null> => {
    const theCookie = cookie.parse(req.headers.cookie!)
    const token = theCookie.auth

    let user: Payload | null
    try {
        user = verify(token, `${process.env.JWT_SECRET}`) as Payload
    }
    catch (error){
        throw "unverified"
    }
    return user
}

//Delete the cookie on log out.
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
