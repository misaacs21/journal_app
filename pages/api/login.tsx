import { useDb } from '../../utils/database'
import { getUser } from '../../utils/user'
import {sign} from 'jsonwebtoken'

const login = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        if (user) {
            const jwt = sign({user:user.username},`${process.env.JWT_SECRET}`)
            console.log(jwt)    
        }

        return res.send(user)
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
})

export default login
