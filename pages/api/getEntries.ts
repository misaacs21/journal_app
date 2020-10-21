import { extractFromCookie } from '../../utils/cookie'
import { useDb } from '../../utils/database'
import { getJournals } from '../../utils/journals'

const getEntries = useDb(async (db, req, res) => {
    if (req.method == "GET") {
        res.statusCode = 200

        console.log('~~~', req)

        const payload = await extractFromCookie(req)
        console.log("PAYLOAD ID: " + payload)
        const response = await getJournals(payload!._id, db)
        return res.send(response)
    }
    res.statusCode = 405
    return res.send("Only GET messages are supported.")
})

export default getEntries
