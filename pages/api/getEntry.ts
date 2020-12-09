import { useDb } from '../../utils/database'
import { getOneJournal } from '../../utils/journals'

//Get journal entry for a given day
//Could be a GET by sending argument in url or query
const getEntry = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        const response = await getOneJournal(req.body.id, req.body.date, db)
        return res.send(response)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default getEntry
