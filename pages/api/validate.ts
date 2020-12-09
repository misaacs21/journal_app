import {extractFromCookieIncomingMsg } from '../../utils/cookie'
import { NextApiRequest, NextApiResponse } from "next"

//Determine if a user is logged in or not
const validate = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        try {
            res.statusCode = 200
            await extractFromCookieIncomingMsg(req) //will throw an error if user is not validated
            return res.send("ok")
        }
        catch (error) {
            throw error
        }
    }
    res.statusCode = 405
    return res.send("Only GET messages are supported.")
}

export default validate;