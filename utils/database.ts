import { assert } from 'console';
import {Db, MongoClient} from 'mongodb'

const url = 'mongodb://localhost:27017'
const dbName = 'journal_app'
let appClient: MongoClient

export const connect = (): Promise<Db> => {
    if (appClient) {
        return Promise.resolve(appClient.db(dbName))
    }
    return new Promise((resolve,reject) => {
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
}

export const close = (): Promise<void> => {
    if (!appClient) {
        return Promise.resolve()
    }
    return new Promise((resolve,reject) => {
        appClient.close((err) => {
            if (err) {
                console.error("Unable to close MongoDB database", err)
                return reject(err)
            }
            console.log("Database connection closed")
            return resolve()
        })
    })
}