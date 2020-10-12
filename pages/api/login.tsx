import { Db } from "mongodb"
import { NextApiRequest,NextApiResponse } from "next"
import {connect,close} from "../../utils/database"
import {User} from "../../utils/user"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    //await promise, if resolves, return that, if rejects, throw error -> try catch
    if (req.method == "POST") {
        let db: Db
        try {
            db = await connect()
        } 
        catch (error) {
            console.error(error)
            res.status(500)
            res.send(`Database connection error: ${ error.toString() }`)
            return await close()
            
            //redirect to error page
        }

        res.statusCode = 200
        const users = db.collection('journal_app')

        let user: User | null
                try {
            user = await users.findOne<User>(req.body)  
            console.log("login.tsx:")
            console.log("~~~ user ", user)
        }
        catch (error) {
            await close()
            return res.send(500)
        }
        await close()
        return res.send(user) 
    }
}
  