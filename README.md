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
```
where \[username\], \[password\], and \[database name\] are for your own personal MongoDB database, which has "users" and "journal_entries" collections.

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

Current relevant pages: /auth

## Remnants
index.tsx is the default home page provided by create-next-app, saved for future reference. This will be replaced in the future.

## Limitations
This app will not run on Internet Explorer. Please use another browser.

## Known Bugs
Login and Signup components do not distinguish states, so the most recent input from EITHER will be taken upon submit, regardless of which form is submitted.