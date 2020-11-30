import { extractFromCookie, extractFromCookie2 } from '../../utils/cookie'
import { useDb } from '../../utils/database'
import { getJournals } from '../../utils/journals'

//Can't do a GET and still pass date, so is POST accurate? 
const getEntries = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        const payload = await extractFromCookie2(req)
        const response = await getJournals(payload!._id, req.body.date, db)
        return res.send(response)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default getEntries
