import { NextApiRequest } from 'next'
import { Db, ObjectID } from 'mongodb'
import { hash, compare } from 'bcrypt'

export interface User {
    _id: ObjectID,
    username: string,
    password: string
}

export const getUser = async (userInfo: NextApiRequest["body"], db: Db): Promise<User | null> => {
    const users = db.collection('users')
    let user: User | null

    try {
        user = await users.findOne<User>({username: userInfo.username})
        if (user) {
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

export const createUser = async (userInfo: NextApiRequest["body"], db: Db): Promise<null | void> => {
    const users = db.collection('users')
    let jwt: string
    try {
        const hashed = await hash(userInfo.password, 10)
        userInfo.password = hashed
        await users.insertOne(userInfo)
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    return Promise.resolve()
}