import { useDb } from '../../utils/database'
import { getUser } from '../../utils/user'
import {createCookie, extractFromCookieRequest} from '../../utils/cookie'

//Login, given a username and password, as well as create a cookie for their session
const login = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        try {
            res.statusCode = 200
            let user = await getUser(req.body, db)
            if (!user) return res.send(null)
            let theCookie = await extractFromCookieRequest(req)
            if (user && theCookie == null) {
                res.setHeader('Set-Cookie', await createCookie(user.username, user._id) )
            }

            return res.send({_id: user?._id, username: user?.username})
        }
        catch (error) {
            console.log(error)
        }
        
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default login
