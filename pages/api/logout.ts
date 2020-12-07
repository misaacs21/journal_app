import { NextApiRequest, NextApiResponse } from "next"
import {destroyCookie} from '../../utils/cookie'

//Logout -- destroy cookie
const logout = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "DELETE") {
        res.status(200)
        res.setHeader('Set-Cookie', await destroyCookie())
        return res.send("successfully deleted")
    }
    res.statusCode = 405
    return res.send("Only DELETE messages are supported.")
}

export default logout
