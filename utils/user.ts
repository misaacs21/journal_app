import { NextApiRequest } from 'next'
import { Db } from 'mongodb'

export interface User {
    username: String
    password: String
}

export const getUser = async (userInfo: NextApiRequest["body"], db: Db): Promise<User | null> => {
    const users = db.collection('journal_app')
    let user: User | null

    try {
        user = await users.findOne<User>(userInfo)
        console.log("user.ts:")
        console.log("~~~ user ", user)
    }
    catch (error) {
        return Promise.reject('Database access error')
    }
    return user
}

export const createUser = async (userInfo: NextApiRequest["body"], db: Db): Promise<null | void> => {
    const users = db.collection('journal_app')
    
    try {
        await users.insertOne(userInfo)
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    return Promise.resolve()
}