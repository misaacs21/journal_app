export interface User {
    username: String
    password: String
}

//What does this file even do now?
export const checkAuthentication = async (username: string, password: string): Promise<User | null> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        }),
    })
    let user: Promise<User | null>
    let temp = await response.clone().text()
    console.log('~~~ response.body', temp)

    if (!temp)
    {
        user = Promise.resolve(null)
        return user
    }
    user = response.json()
    return user
}