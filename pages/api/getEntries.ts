import { extractFromCookieIncomingMsg } from '../../utils/cookie'
import { useDb } from '../../utils/database'
import { getJournals } from '../../utils/journals'

//Get journal entries in a given month
//Could be a GET by sending argument in url or query
const getEntries = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        try {
            res.statusCode = 200
            const payload = await extractFromCookieIncomingMsg(req)
            console.log(JSON.stringify(payload));
            const response = await getJournals(payload!._id, req.body.date, db)
            const packagedResponse = {
                user: payload,
                entries: response
            }
            return res.send(packagedResponse)
        }       
        catch (error){
            throw error
        } 
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default getEntries
