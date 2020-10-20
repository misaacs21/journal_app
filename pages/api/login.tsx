import { useDb } from '../../utils/database'
import { getUser } from '../../utils/user'

const login = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        return res.send(user)
    }
    return res.status(405)
})

export default login
