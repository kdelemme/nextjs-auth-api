This is a very basic example of a custom authentication implementation using an external backend API (using express) and nextjs.

## Demo

Start the backend API:

```bash
cd back/
npm install
npm run dev
```

Start the nextjs app:

```bash
cd front/
cp .env.sample .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and register an account.

## Implementation details

- This is a very basic implementation of register/signin flow. You should add proper validation in the different endpoints.
- Using an in memory "DB" to store the user. You might want to change that.
- `accessToken` are never invalidated on the backend API. You might want to support that.
- Session only contains the email and accessToken. You might want to include other things like roles, ...
- Sessions are encrypted and stored in a jwt token in a cookie. This is the reason why we proxy the register/signin calls from client -> next server api -> external backend api
- When calling a backend protected endpoint, use the `Authorization: 'Bearer session.accessToken'` either from `useSession()` for client components or from `getServerSession()` for server components.

## Questions & feedback?

Twitter: [@kdelemme](https://twitter.com/kdelemme)
