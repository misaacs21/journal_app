import {Db, MongoClient} from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

const url = 'mongodb+srv://admin:admin@journal-app.hcmph.mongodb.net/journal_app?retryWrites=true&w=majority'
const dbName = 'users'
let appClient: MongoClient | null

type NextMiddlewareWithDb = (database: Db, req: NextApiRequest, res: NextApiResponse) => Promise<void>
type NextMiddleware = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

export const useMongo = async (middleware: NextMiddlewareWithDb) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let client: MongoClient

    try {
        client = await MongoClient.connect(url)
    }
    catch (error) {
        console.error('Unable to connecto to MongoDB database', error)
        throw error
    }

    const db = client.db(dbName)
    console.log('Connected to MongoDB datbase.')

    try {
        await middleware(db, req, res)
    }
    catch (error) {
        console.error('Error while calling Next middleware', error)
        await client.close()

        throw error
    }
    await client.close()
}

// export const connect = (): Promise<Db> => new Promise((resolve,reject) => {
//     if (appClient) {
//         return resolve(appClient.db(dbName))
//     }

//     MongoClient.connect(url,function(err,client) {
//         if (err) {
//             console.error("Unable to connect to MongoDB database", err)
//             return reject(err)
//         }
//         appClient = client
//         const db = appClient.db(dbName)
//         console.log("Connected to MongoDB database")
//         return resolve(db)
//     })
// })

// export const close = (): Promise<void> => new Promise((resolve,reject) => {
//     if (!appClient) {
//         return resolve()
//     }

//     appClient.close((err) => {
//         if (err) {
//             console.error("Unable to close MongoDB database", err)
//             return reject(err)
//         }
//         console.log("Database connection closed")
//         appClient = null
//         return resolve()
//     })
// })
