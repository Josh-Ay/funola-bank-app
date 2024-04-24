# Funola Banking Application API
The Funola Banking Application API is a RESTFul API built using the [Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC) design pattern.

- Local API Link: `http://localhost:5000`

<!-- Live API Link: `https://yoola-bank-app.onrender.com` -->
- Live API Link: `https://real-fly-hoodie.cyclic.app`

- Postman Documentation Link: `https://documenter.getpostman.com/view/26461326/2sA3BrYqdg`
- Database Entity-Relationship Diagram: `https://app.eraser.io/workspace/0DTqxwHdSSSo1Jqu6sfr?origin=share`

<br />

### Table of Contents
- [Summary of routes](#summary-of-routes)
- [Built with](#built-with)
- [How to run](#how-to-run)
- [Detailed routes description](#detailed-routes-description)

### Summary of routes
<table>
    <thead>
        <tr>
            <th>Route</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/test</td>
            <td>Testing routes for the application</td>
        </tr>
        <tr>
            <td>/auth</td>
            <td>Routes to handle all authentication related-logic in the application</td>
        </tr>
        <tr>
            <td>/user</td>
            <td>Routes to handle all user-related requests in the application</td>
        </tr>
        <tr>
            <td>/wallet</td>
            <td>Routes to handle creation, funding, transfers and withdrawals of/from wallet.</td>
        </tr>
        <tr>
            <td>/card</td>
            <td>Routes to handle creation, funding and withdrawals of/from ATM cards.</td>
        </tr>
        <tr>
            <td>/deposit</td>
            <td>Routes to handle creation of new deposits in the application.</td>
        </tr>
        <tr>
            <td>/atm</td>
            <td>Routes to handle fetching of dummy ATMs in the application.</td>
        </tr>
        <tr>
            <td>/bank</td>
            <td>Routes to handle saving, updating and retreival of user bank details in the application.</td>
        </tr>
    </tbody>
</table>

### Built with
- Javascript
- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML/CSS

### How to run
To run this application, you'll need [Node.js](https://nodejs.org/en/download/) installed on your computer. You can either clone or download a .zip file to get your own local copy.

<br />

If you would like to clone this repository, open up a terminal and type this:
```bash
# Clone this repository
$ git clone https://github.com/Josh-Ay/funola-bank-app.git
```

Open up your copy of this project and follow the following steps:
- Install all dependencies by running:
```bash
# Install all dependencies
$ npm install
```
- Create a new .env file and set the following:
    1. MONGO_DB_URI=mongodb://127.0.0.1:27017/<name_of_db> <mark style='background-color: #999; color: #fff'>This uri format only works if you have MongoDB installed locally on your device. Alternatively, you can replace this with a remote mongo database uri.</mark>
    2. SALT_ROUNDS=2
    3. ADMIN_MAIL=`<yourgmail>@gmail.com`

    <br />
    
    Follow this [link](https://support.google.com/accounts/answer/185833?hl=en) to get the values for the next variable: `ADMIN_MAIL_PASSWORD`.

    4. ADMIN_MAIL_PASSWORD=''
    5. VERIFICATION_TOKEN_SECRET=secret
    6. SERVER_URL=http://localhost:5000
    7. ACCESS_TOKEN_SECRET=secret
    8. REFRESH_TOKEN_SECRET=secret
    9. RESET_TOKEN_SECRET=secret

    <br />
    
    Follow this [link](https://www.twilio.com/docs/sms/quickstart/node) to get the values for the following variables: `TWILIO_AUTH_TOKEN`, `TWILIO_SID`.

    10. TWILIO_AUTH_TOKEN=''
    11. TWILIO_SID=''

    <br />

    12. COOKIE_SECRET=secret
    13. ADMIN_ACCESS_TOKEN_SECRET=secret
    14. FUND_LIMIT_RESET_ROUTE=/reset

- When done, save all changes then run the server using:

```bash
# Run the server
$ node app.js
```

-That's all! You should see your server successfully running on port 5000.

<br />

**Happy hacking!**

<br />

### Detailed routes description
<table>
    <thead>
        <tr>
            <th>Route</th>
            <th>METHOD</th>
            <th>Description</th>
            <th>Authorization Needed</th>
            <th>Admin only access</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/test/status</td>
            <td>GET</td>
            <td>Check that the API is up and working fine.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/code</td>
            <td>POST</td>
            <td>Send a verification code to a user.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/verify-code</td>
            <td>POST</td>
            <td>Check the validity of a verification code.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/register</td>
            <td>POST</td>
            <td>Register a new user.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/verify</td>
            <td>GET</td>
            <td>Verify a new account.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/login</td>
            <td>POST</td>
            <td>Login an existing user.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/request-password-reset</td>
            <td>POST</td>
            <td>Request for a password reset.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>GET</td>
            <td>Verify a password reset link.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>PUT</td>
            <td>Reset a password for a user.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/change-password</td>
            <td>PUT</td>
            <td>Change the password of an existing user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/refresh-token</td>
            <td>POST</td>
            <td>Refresh a user's access to the api using a token.</td>
            <td>False</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/login-status</td>
            <td>GET</td>
            <td>Confirm a user's access to the api.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/logout</td>
            <td>GET</td>
            <td>Logout a logged-in user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/profile</td>
            <td>GET</td>
            <td>Get a user's details.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/update-profile/:updateType</td>
            <td>PUT</td>
            <td>Update a user's details.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/notifications</td>
            <td>GET</td>
            <td>Get notifications of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/users</td>
            <td>GET</td>
            <td>Get details of other users.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/transaction-pin-status</td>
            <td>GET</td>
            <td>Check if user has set a transaction pin.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/user/login-pin-status</td>
            <td>GET</td>
            <td>Check if user has set a login pin.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/create</td>
            <td>POST</td>
            <td>Create a new wallet for a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/balance</td>
            <td>GET</td>
            <td>Get the wallet balances of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/fund</td>
            <td>PUT</td>
            <td>Fund a wallet of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/transfer/:type</td>
            <td>POST</td>
            <td>Transfer funds from a user's wallet.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/withdrawal</td>
            <td>POST</td>
            <td>Withdraw funds from a user's wallet.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/swap</td>
            <td>POST</td>
            <td>Swap funds between wallets.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/wallet/request</td>
            <td>POST</td>
            <td>Request wallet funding from another user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
            <td>/wallet/recents</td>
            <td>GET</td>
            <td>Get the recent recipients of transactions made with wallet.</td>
            <td>True</td>
            <td>False</td>
        </tr>
            <td>/wallet/transactions/:id</td>
            <td>GET</td>
            <td>Get transaction details of wallet.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/create/:type</td>
            <td>POST</td>
            <td>Create a new card for a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/detail</td>
            <td>GET</td>
            <td>Get all card details of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/fund/:id</td>
            <td>POST</td>
            <td>Fund a user's card.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/transactions/:id</td>
            <td>GET</td>
            <td>Get the transactions made on a user's card.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/update-setting/:id/:type</td>
            <td>PATCH</td>
            <td>Update the settings of a user's card.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/card/single-card-detail/:id</td>
            <td>GET</td>
            <td>Get the details of a user's card.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/deposit/</td>
            <td>GET</td>
            <td>Get deposits of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/deposit/new</td>
            <td>POST</td>
            <td>Create a new deposit for a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/atm/new</td>
            <td>POST</td>
            <td>Create a new ATM entry.</td>
            <td>True</td>
            <td>True</td>
        </tr>
        <tr>
            <td>/atm/nearby-atms</td>
            <td>GET</td>
            <td>Get all ATMS within a 500m radius.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/atm/find-atms</td>
            <td>POST</td>
            <td>Find ATMS within a specified distance.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/bank/</td>
            <td>GET</td>
            <td>Get all saved banks of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/bank/new</td>
            <td>POST</td>
            <td>Add a new saved bank for a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/bank/update/:id</td>
            <td>PATCH</td>
            <td>Update existing bank details of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
        <tr>
            <td>/bank/delete/:id</td>
            <td>DELETE</td>
            <td>Delete a saved bank of a user.</td>
            <td>True</td>
            <td>False</td>
        </tr>
    </tbody>
</table>
