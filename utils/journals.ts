import { Db, Cursor} from 'mongodb'
import Sentiment from 'sentiment'
import * as contractions from 'contractions'
import * as sw from 'stopword'

export interface journalEntry {
    _id: string,
    userID: string,
    date: Date,
    entry: string,
    mood: number
}

//Create a journal and assign it a mood using natural language processing.
export const createJournal = async (entry: string, userID:string, date: Date, db: Db): Promise<string | null> => {
    const entries = db.collection('journal_entries')
    let expanded = contractions.expand(entry)
    let trimmed = expanded.match(/\b[\w']+\b/g)
    let stripped = sw.removeStopwords(trimmed)
    let senti = new Sentiment()
    let analyzed = senti.analyze(stripped.join(" "))
    let mood = analyzed.score / analyzed.words.length
    try {
        await entries.insertOne({userID, date, entry, mood})
    }
    catch (error){
        return Promise.reject('Database access error')
    }
    return null
}

//Get journals for a given month of the year
export const getJournals = async (id: string, date: string, db: Db): Promise<(journalEntry|null)[] | null> => {
    const entries = db.collection('journal_entries')
    let allJournals: Cursor | null
    let inDate = new Date(date)
    let startDay = new Date(inDate.getFullYear(), inDate.getMonth(),1).getDay()
    try {
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
        entry.date = new Date(entry.date)
        journalArray.push(entry)
    })

    let journalCalArray: (journalEntry|null)[] = []
    let found = false
    for (let i = 1; i <43; i++) { //MORE EFFICIENT WAY OF DOING THIS?
        found = false
        if (i >= startDay) {
            for (let j = 0; j < journalArray.length; j++) {
                if (journalArray[j].date.getDate() == (i-startDay)) {
                    journalCalArray.push(journalArray[j])
                    found = true
                    break
                }
            }
        }
        if (!found) journalCalArray.push(null)
    }
    return journalCalArray
}

//Get a single journal for a given day
export const getOneJournal = async (id: string, date: string, db: Db): Promise<journalEntry | null> => {
    const entries = db.collection('journal_entries')
    let journal: journalEntry | null = null
    let inDate = new Date(date)
    try {
        journal = JSON.parse(JSON.stringify(entries.findOne({userID:id, date: {
            $gte: new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDay(), 0, 0, 0).toISOString(),
            $lte: new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDay(), 23, 59, 59).toISOString()
        }})))
    }
    catch (error) {
        return Promise.reject('Database access error')
    }
    return journal
}