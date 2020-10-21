import { useDb } from '../../utils/database'
import { getUser, createUser } from '../../utils/user'
import {createCookie, extractFromCookie} from '../../utils/cookie'

const reg = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        let theCookie = await extractFromCookie(req)
        if (!user) {
           await createUser(req.body,db) //what happens if this is rejected?
           user = await getUser(req.body, db)
        }
        if (user && theCookie == null) {
            res.setHeader('Set-Cookie', await createCookie(user.username, user._id) )
        }
        return res.send({_id: user?._id, username: user?.username})
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default reg