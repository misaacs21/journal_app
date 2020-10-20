import { useDb } from '../../utils/database'
import { getUser, createUser } from '../../utils/user'
import {sign} from 'jsonwebtoken'

const reg = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        if (!user) {
           await createUser(req.body,db) //what happens if this is rejected?
        }
        const jwt = sign({user:req.body.username},`${process.env.JWT_SECRET}`)
        console.log(jwt)
        return res.send(user)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default reg