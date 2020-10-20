import { useDb } from '../../utils/database'
import { getUser, createUser } from '../../utils/user'
import {createCookie} from '../../utils/cookie'

const reg = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        if (!user) {
           await createUser(req.body,db) //what happens if this is rejected?
        }
        res.setHeader('Set-Cookie', await createCookie(req.body.username) )
        return res.send(user)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default reg