import { useDb } from '../../utils/database'
import { getUser, createUser } from '../../utils/user'

const reg = useDb(async (db, req, res) => {
    if (req.method == "POST") {
        res.statusCode = 200
        let user = await getUser(req.body, db)
        if (!user) {
            await createUser(req.body,db)
            //put info in new jwt
        }
        return res.send(user)
    }
    return res.status(405)
})

export default reg