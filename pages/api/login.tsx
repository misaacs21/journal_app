import { useMongo } from '../../utils/database'
import { User } from '../../utils/user'

const handler = useMongo(async (db, req, res) => {
    //await promise, if resolves, return that, if rejects, throw error -> try catch
    if (req.method == "POST") {
        res.statusCode = 200
        const users = db.collection('journal_app')

        let user: User | null
                try {
            user = await users.findOne<User>(req.body)
            console.log("login.tsx:")
            console.log("~~~ user ", user)
        }
        catch (error) {
            return res.send(500)
        }

        return res.send(user)
    }
})

export default handler
