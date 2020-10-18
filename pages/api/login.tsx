import { useContext } from '../../utils/database'
import { User } from '../../utils/user'
<<<<<<< HEAD

const handler = useContext(async ({ db }, req, res) => {
    //await promise, if resolves, return that, if rejects, throw error -> try catch
    console.log("in api")
    if (req.method == "POST") {
        res.statusCode = 200
        //do this stuff within user util?
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

/*
import { Db } from "mongodb"
import { NextApiRequest,NextApiResponse } from "next"
import {connect,close} from "../../utils/database"
import {User} from "../../utils/user"
=======
>>>>>>> 94fe3577b8a8ec80e881fbe307e725aa55e9bb02

const handler = useContext(async ({ db }, req, res) => {
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
<<<<<<< HEAD
            //make sure close() is not called multiple times at once! wrapper function to do connection stuff before ANYTHING is called?
            await close()
=======
>>>>>>> 94fe3577b8a8ec80e881fbe307e725aa55e9bb02
            return res.send(500)
        }

        return res.send(user)
    }
<<<<<<< HEAD
}
*/
  
=======
})

export default handler
>>>>>>> 94fe3577b8a8ec80e881fbe307e725aa55e9bb02
