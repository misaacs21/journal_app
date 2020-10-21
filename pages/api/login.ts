import { useDb } from '../../utils/database'
import { getUser } from '../../utils/user'
import {createCookie, extractFromCookie} from '../../utils/cookie'

const login = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        let theCookie = await extractFromCookie(req)
        if (user && theCookie == null) {
            res.setHeader('Set-Cookie', await createCookie(user.username, user._id) )
        }

        return res.send({_id: user?._id, username: user?.username}) //clean up how this stuff is passed around
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default login
