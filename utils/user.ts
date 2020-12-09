import { Db, ObjectID } from 'mongodb'
import { hash, compare } from 'bcrypt'

export interface User {
    _id: ObjectID,
    username: string,
    password: string
}

//Match a user to the database, first finding them by username and then comparing passwords.
export const getUser = async (userInfo: any, db: Db): Promise<User | null> => {
    const users = db.collection('users')
    let user: User | null

    try {
        user = await users.findOne<User>({username: userInfo.username})
        if (user != null) {
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

//Add user to database, hashing password for security.
export const createUser = async (userInfo: any, db: Db): Promise<null | void> => { 
    let temp = userInfo
    const users = db.collection('users')
    try {
        const hashed = await hash(temp.password, 10)
        temp.password = hashed
        await users.insertOne(temp)
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    return null
}