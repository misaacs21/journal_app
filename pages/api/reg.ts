import { useDb } from '../../utils/database'
import { getUser, createUser } from '../../utils/user'
import {createCookie, extractFromCookie} from '../../utils/cookie'

const reg = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        console.log(req.body.username + " " + req.body.password)
        res.statusCode = 200
        let user = await getUser(req.body, db)

        if (!user) {
            let newUser = {
                username: req.body.username,
                password: req.body.password
            }
           await createUser(newUser,db) //what happens if this is rejected? //why is newUser changed within this function that's not how parameters work?? i thought???
           console.log("between: " + req.body.username + " " + req.body.password)
           user = await getUser(req.body, db)
        }
        let theCookie = await extractFromCookie(req)
        if (user && theCookie == null) {
            res.setHeader('Set-Cookie', await createCookie(user.username, user._id) )
        }
        return res.send({_id: user?._id, username: user?.username})
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default reg