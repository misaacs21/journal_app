import { Db, Cursor} from 'mongodb'

export interface journalEntry {
    _id: string,
    userID: string,
    date: Date,
    entry: string
}

export const createJournal = async (entry: string, userID:string, date: Date, db: Db): Promise<string | null> => {
    console.log("EVEN MORE ID: " + userID)
    const entries = db.collection('journal_entries')
    try {
        await entries.insertOne({userID, date, entry})
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    return null
}

export const getJournals = async (id: string, date: string, db: Db): Promise<journalEntry[] | null> => {
    const entries = db.collection('journal_entries')
    let allJournals: Cursor | null
    let inDate = new Date(date)
    try {
        console.log(date)
        allJournals = entries.find({userID:id, date: {
            $gte: new Date(inDate.getFullYear(), inDate.getMonth(), 1, 0, 0, 0).toISOString(),
            $lte: new Date(inDate.getFullYear(), inDate.getMonth()+1, 0, 23, 59, 59).toISOString()
        }})
    }
    catch (error) {
        return Promise.reject('Database access error')
    }
    if (await allJournals.count() == 0) {
        allJournals = null
    }
    let journalArray: journalEntry[] = []
    await allJournals?.forEach(entry=> {
        journalArray.push(entry)
    })
    return journalArray
}