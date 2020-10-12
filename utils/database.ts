import {Db, MongoClient} from 'mongodb'

const url = 'mongodb+srv://admin:admin@journal-app.hcmph.mongodb.net/journal_app?retryWrites=true&w=majority'
const dbName = 'users'
let appClient: MongoClient | null

export const connect = (): Promise<Db> => new Promise((resolve,reject) => {
    if (appClient) {
        return resolve(appClient.db(dbName))
    }

    MongoClient.connect(url,function(err,client) {
        if (err) {
            console.error("Unable to connect to MongoDB database", err)
            return reject(err)
        }
        appClient = client
        const db = appClient.db(dbName)
        console.log("Connected to MongoDB database")
        return resolve(db)
    })
})

export const close = (): Promise<void> => new Promise((resolve,reject) => {
    if (!appClient) {
        return resolve()
    }

    appClient.close((err) => {
        if (err) {
            console.error("Unable to close MongoDB database", err)
            return reject(err)
        }
        console.log("Database connection closed")
        appClient = null
        return resolve()
    })
})
