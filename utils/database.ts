import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

require('dotenv').config()

const url = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@journal-app.hcmph.mongodb.net/journal_app?retryWrites=true&w=majority`
const dbName = `${ process.env.DB_NAME }`

type NextMiddlewareWithDb = (db: Db, req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any>>
type NextMiddleware = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

export const useDb = (middleware: NextMiddlewareWithDb): NextMiddleware => async (req, res): Promise<void> => {
    let client: MongoClient

    try {
        client = await MongoClient.connect(url)
    }
    catch (error) {
        console.error('Unable to connect to MongoDB database', error)
        throw error
    }

    const db = client.db(dbName)
    console.log('Connected to MongoDB datbase.')

    // You can expand this to manage all of the resources that you need for a request lifecycle

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
