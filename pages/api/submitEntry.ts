import { useDb } from '../../utils/database'
import { createJournal } from '../../utils/journals'

const submitEntry = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        const response = await createJournal(req.body.entry, req.body.userID, req.body.date, db)
        return res.send(response)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default submitEntry