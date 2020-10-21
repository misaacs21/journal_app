import { NextApiRequest, NextApiResponse } from "next"

//make this into the route for the auth'd page(s)...have a conditional for if having a valid jwt -> true or not having a valid jwt -> true
const reroute = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        res.writeHead(302, {
            Location: req.body.url
        })
        return res.end()
    }
    res.statusCode = 405
    return res.send("Only POST messages are supported.")
}

export default reroute