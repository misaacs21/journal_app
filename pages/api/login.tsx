import { NextApiRequest,NextApiResponse } from "next"
import {connect,close} from "../../utils/database"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    //await promise, if resolves, return that, if rejects, throw error -> try catch
    if (req.method == "POST") {
        const db = await connect()
        //check it matches db
        console.log(req.body)
        const {username} = JSON.parse(req.body)
        res.statusCode = 200
        await close()
        return (res.json({username}))
    }
    res.statusCode=404
    res.send("Not found")
}
  