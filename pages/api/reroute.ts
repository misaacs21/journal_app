import { NextApiRequest, NextApiResponse } from "next"

//Dummy code preserved for possible future rerouting overhaul
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