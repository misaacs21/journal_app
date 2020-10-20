# WiCSE Shadow Journaling App with Sentiment Analysis
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Execution
In the root project directory:
```bash
npm install
```
```bash
echo DB_USER = [username] > .env.local
echo DB_PASS = [password] >> .env.local
echo DB_NAME = [database name] >> .env.local
echo JWT_SECRET = [secret key] >> .env.local
```
where \[username\], \[password\], and \[database name\] are for your own personal [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database, which has "users" and "journal_entries" collections, and [secret key] is any phrase to use for JWT encryption. 

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

Current relevant pages: /auth

## Limitations
This app will not run on Internet Explorer. Please use another browser.