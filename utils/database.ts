import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

const url = 'mongodb+srv://admin:admin@journal-app.hcmph.mongodb.net/journal_app?retryWrites=true&w=majority'
//put into env file, and make sure you erase from commit history as well!
const dbName = 'users'

interface AppContext {
    db: Db
}

type NextMiddlewareWithDb = (context: AppContext, req: NextApiRequest, res: NextApiResponse) => Promise<void>
type NextMiddleware = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

export const useContext = (middleware: NextMiddlewareWithDb): NextMiddleware => async (req, res): Promise<void> => {
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
    const appContext: AppContext = {
        db,
    }

    try {
        await middleware(appContext, req, res)
    }
    catch (error) {
        console.error('Error while calling Next middleware', error)
        await client.close()

        throw error
    }
    await client.close()
}
