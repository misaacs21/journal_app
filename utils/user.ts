import { NextApiRequest } from 'next'
import { Db, ObjectID } from 'mongodb'
import { hash, compare } from 'bcrypt'

export interface User {
    _id: ObjectID,
    username: string,
    password: string
}

export const getUser = async (userInfo: NextApiRequest["body"], db: Db): Promise<User | null> => {
    console.log("USERNAME:" +  userInfo.username)
    console.log("PASS USER: " + userInfo.password)
    const users = db.collection('users')
    let user: User | null

    try {
        user = await users.findOne<User>({username: userInfo.username})
        if (user) {
            console.log("it is a user! " + userInfo.password + user.password)
            let passwordMatch: boolean = await compare(userInfo.password, user.password)
            if (!passwordMatch) {
                user = null
            }
        }
        console.log("user.ts:")
        console.log("~~~ user ", user)
    }
    catch (error) {
        return Promise.reject('Database access error')
    }
    return user
}

//make it so that requests are in json format before sending to utils?
export const createUser = async (userInfo: any, db: Db): Promise<null | void> => {
    let temp = userInfo
    console.log("temp : " + temp.password)
    console.log("user info: " + userInfo.password)
    const users = db.collection('users')
    let jwt: string
    try {
        const hashed = await hash(temp.password, 10)
        temp.password = hashed
        console.log("temp : " + temp.password)
        console.log("user info: " + userInfo.password)
    
        await users.insertOne(temp)
        console.log("temp : " + temp.password)
        console.log("user info: " + userInfo.password)
    
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    console.log("temp : " + temp.password)
    console.log("user info: " + userInfo.password)

    return null
}