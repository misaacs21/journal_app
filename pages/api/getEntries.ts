import { extractFromCookie, extractFromCookie2 } from '../../utils/cookie'
import { useDb } from '../../utils/database'
import { getJournals } from '../../utils/journals'

const getEntries = useDb(async (db, req, res) => {
    if (req.method == "GET") {
        res.statusCode = 200
        console.log("TO STRING: " + JSON.stringify(req.cookies))
        const payload = await extractFromCookie2(req)
        console.log("PAYLOAD ID: " + payload!._id)
        const response = await getJournals(payload!._id, db)
        return res.send(response)
    }
    res.statusCode = 405
    return res.send("Only GET messages are supported.")
})

export default getEntries
