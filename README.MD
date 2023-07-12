# Funola Banking Application API
The Funola Banking Application API is a RESTFul API built using the [Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC) design pattern.

Local API Link: `http://localhost:5000`

<!-- Live API Link: `https://yoola-bank-app.onrender.com` -->
Live API Link: `https://real-fly-hoodie.cyclic.app`

<br />

### Table of Contents
- [Summary of routes](#summary-of-routes)
- [Built with](#built-with)
- [How to run](#how-to-run)
- [Helpful technical stuff](#helpful-technical-stuff)
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
    1. MONGO_DB_URI=mongodb://127.0.0.1:27017/<name_of_db> <mark style='background-color: #999; color: #fff'>This uri format only works if you have MongoDB insalled locally on your device. Alternatively, you can replace this with a remote mongo database uri.</mark>
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
    
    Follow this [link](https://developer.flutterwave.com/docs/quickstart) to get the values for the following variables: `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_ENCRYPTION_KEY`.

    12. FLW_PUBLIC_KEY=''
    13. FLW_SECRET_KEY=''
    14. FLW_ENCRYPTION_KEY=''

    <br />

    15. COOKIE_SECRET=secret

- When done, save all changes then run the server using:

```bash
# Run the server
$ node app.js
```

-That's all! You should see your server successfully running on port 5000.

<br />

**Happy hacking!**

<br />

### Helpful technical stuff
- [Postman Documentation Link](#helpful-technical-stuff)
- [Database Entity-Relationship Diagram](https://app.eraser.io/workspace/0DTqxwHdSSSo1Jqu6sfr?origin=share)

<br />

### Detailed routes description
<table>
    <thead>
        <tr>
            <th>Route</th>
            <th>METHOD</th>
            <th>Description</th>
            <th>Request Details</th>
            <th>Authorization Needed</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/test/status</td>
            <td>GET</td>
            <td>Check that the API is up and working fine.</td>
            <td><a href='#get-teststatus'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/code</td>
            <td>POST</td>
            <td>Send a verification code to a user.</td>
            <td><a href="#post-authcode">Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/verify-code</td>
            <td>POST</td>
            <td>Check the validity of a verification code.</td>
            <td><a href='#post-authverify-code'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/register</td>
            <td>POST</td>
            <td>Register a new user.</td>
            <td><a href='#post-authregister'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/verify</td>
            <td>GET</td>
            <td>Verify a new account.</td>
            <td><a href='#get-authverify'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/login</td>
            <td>POST</td>
            <td>Login an existing user.</td>
            <td><a href='#post-authlogin'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/request-password-reset</td>
            <td>POST</td>
            <td>Request for a password reset.</td>
            <td><a href='#post-authrequest-password-reset'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>GET</td>
            <td>Verify a password reset link.</td>
            <td><a href='#get-authreset-password'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>PUT</td>
            <td>Reset a password for a user.</td>
            <td><a href='#put-authreset-password'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/change-password</td>
            <td>PUT</td>
            <td>Change the password of an existing user.</td>
            <td><a href='#put-authchange-password'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/auth/refresh-token</td>
            <td>POST</td>
            <td>Refresh a user's access to the api using a token.</td>
            <td><a href='#post-authrefresh-token'>Details</a></td>
            <td>False</td>
        </tr>
        <tr>
            <td>/auth/login-status</td>
            <td>GET</td>
            <td>Confirm a user's access to the api.</td>
            <td><a href='#get-authlogin-status'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/user/profile</td>
            <td>GET</td>
            <td>Get a user's details.</td>
            <td><a href='#get-userprofile'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/user/update-profile/:updateType</td>
            <td>PUT</td>
            <td>Update a user's details.</td>
            <td><a href='#put-userupdate-profileupdatetype'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/user/notifications</td>
            <td>GET</td>
            <td>Get notifications of a user.</td>
            <td><a href='#get-usernotifications'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/user/users</td>
            <td>GET</td>
            <td>Get details of other users.</td>
            <td><a href='#get-userusers'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/create</td>
            <td>POST</td>
            <td>Create a new wallet for a user.</td>
            <td><a href='#post-walletcreate'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/balance</td>
            <td>GET</td>
            <td>Get the wallet balances of a user.</td>
            <td><a href='#get-walletbalance'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/fund</td>
            <td>PUT</td>
            <td>Fund a wallet of a user.</td>
            <td><a href='#put-walletfund'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/transfer/:type</td>
            <td>POST</td>
            <td>Transfer funds from a user's wallet.</td>
            <td><a href='#post-wallettransfertype'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/withdrawal</td>
            <td>POST</td>
            <td>Withdraw funds from a user's wallet.</td>
            <td><a href='#post-walletwithdrawal'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/swap</td>
            <td>POST</td>
            <td>Swap funds between wallets.</td>
            <td><a href='#post-walletswap'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/wallet/request</td>
            <td>POST</td>
            <td>Request wallet funding from another user.</td>
            <td><a href='#post-walletrequest'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/card/create/:type</td>
            <td>POST</td>
            <td>Create a new card for a user.</td>
            <td><a href='#post-cardcreatetype'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/card/detail</td>
            <td>GET</td>
            <td>Get a user's card details.</td>
            <td><a href='#get-carddetail'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/card/fund/:currency</td>
            <td>POST</td>
            <td>Fund a user's card.</td>
            <td><a href='#post-cardfundcurrency'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/card/transactions/:currency</td>
            <td>GET</td>
            <td>Get the transactions made on a user's card.</td>
            <td><a href='#get-cardtransactionscurrency'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/deposit/</td>
            <td>GET</td>
            <td>Get deposits of a user.</td>
            <td><a href='#get-deposit'>Details</a></td>
            <td>True</td>
        </tr>
        <tr>
            <td>/deposit/new</td>
            <td>POST</td>
            <td>Create a new deposit for a user.</td>
            <td><a href='#post-depositnew'>Details</a></td>
            <td>True</td>
        </tr>
    </tbody>
</table>

### GET `/test/status`
Check that the API is up and working fine.

REQUEST BODY/PARAMS

`None`


### POST `/auth/code`
Send a verification code to a user.

REQUEST BODY
<table>
    <tr>
        <td>
            number
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Number you would like to send a verification code to.</span>
        </td>
    </tr>
</table>


### POST `/auth/verify-code`
Check the validity of a verification code.

REQUEST BODY
<table>
    <tr>
        <td>
            code
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) 4-digit number you would like to validate.</span>
        </td>
    </tr>
    <tr>
        <td>
            number
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Number that received the verification code.</span>
        </td>
    </tr>
</table>

### POST `/auth/register`
Register a new user.

REQUEST BODY
<table>
    <tr>
        <td>
            firstName
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) First name of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            lastName
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Last name of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Email of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            password
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Password for the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            dateOfBirth
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Date of birth of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            country
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Country of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            phoneNumber
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) 10-13 digit phone number of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            phoneNumberExtension
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) 1-4 digit phone number extension of the new user.</span>
        </td>
    </tr>
    <tr>
        <td>
            title
        </td>
        <td>
            String.
            <br />
            <span style="font-size: 0.9rem;">(required) Title of the new user.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: Mr | Miss | Mrs</span>
        </td>
    </tr>
    <tr>
        <td>
            gender
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Gender of the new user.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: M | F</span>
        </td>
    </tr>
</table>

### GET `/auth/verify`
Verify a new account.

REQUEST QUERY PARAMS
<table>
    <tr>
        <td>
            token
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Verification token of newly registered account you would like to verify.</span>
        </td>
    </tr>
</table>


### POST `/auth/login`
Login an existing user.

REQUEST BODY
<table>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Email of existing user.</span>
        </td>
    </tr>
    <tr>
        <td>
            password
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Password of existing user.</span>
        </td>
    </tr>
</table>

### POST `/auth/request-password-reset`
Request for a password reset.

REQUEST BODY
<table>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Email of the user that would like to request a password reset.</span>
        </td>
    </tr>
</table>

### GET `/auth/reset-password`
Verify a password reset link.

REQUEST QUERY PARAMS
<table>
    <tr>
        <td>
            token
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Reset password token sent to existing user.</span>
        </td>
    </tr>
</table>

### PUT `/auth/reset-password`
Reset a password for a user.

REQUEST QUERY PARAMS
<table>
    <tr>
        <td>
            token
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Reset password token sent to existing user.</span>
        </td>
    </tr>
</table>

REQUEST BODY
<table>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Email of existing user who would like to reset password.</span>
        </td>
    </tr>
    <tr>
        <td>
            password
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New password for the existing user.</span>
        </td>
    </tr>
</table>

### PUT `/auth/change-password`
Change the password of an existing user.

REQUEST BODY
<table>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Email of existing user who would like to change password.</span>
        </td>
    </tr>
    <tr>
        <td>
            previousPassword
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Previous password of the existing user.</span>
        </td>
    </tr>
    <tr>
        <td>
            password
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New password for the existing user.</span>
        </td>
    </tr>
</table>


### POST `/auth/refresh-token`
Refresh a user's access to the api using a token.

REQUEST BODY
<table>
    <tr>
        <td>
            token
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Refresh token of existing user.</span>
        </td>
    </tr>
</table>

### GET `/auth/login-status`
Confirm a user's access to the api.

REQUEST BODY/PARAMS

`None`

### GET `/user/profile`
Get a user's details.

REQUEST BODY/PARAMS

`None`

### PUT `/user/update-profile/:updateType`
Update a user's details.

REQUEST PARAMS

updateType - `name | email | profilePhoto | pin ` 

REQUEST BODY
1. updateType - `name`
<table>
    <tr>
        <td>
            firstName
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New first name you would like to be set for an existing user.</span>
        </td>
    </tr>
     <tr>
        <td>
            lastName
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New last name you would like to be set for an existing user.</span>
        </td>
    </tr>
</table>

2. updateType - `email`
<table>
    <tr>
        <td>
            email
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New email you would like to be set for an existing user.</span>
        </td>
    </tr>
</table>

3. updateType - `profilePhoto` (`NOT IMPLEMENTED YET`)

4. updateType - `pin`
<table>
    <tr>
        <td>
            transactionPin
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) 6-digit pin you would like to be set for a user's transaction pin.</span>
        </td>
    </tr>
</table>

### GET `/user/notifications`

REQUEST BODY
<table>
    <tr>
        <td>
            end
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(optional) Number of notifications you will like to fetch.</span>
        </td>
    </tr>
</table>

### GET `/user/users`

REQUEST BODY/PARAMS

`None`


### POST `/wallet/create`
Create a new wallet for a user.

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency for the new wallet you will like to create.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
</table>


### GET `/wallet/balance`
Get the wallet balances of a user.

REQUEST BODY/PARAMS
`None`


### PUT `/wallet/fund`
Fund a wallet of a user.

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency for the wallet you will like to fund.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            amount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to add to the wallet.</span>
        </td>
    </tr>
</table>

### POST `/wallet/transfer/:type`
Transfer funds from a user's wallet.

REQUEST PARAMS

type - `bank | wallet` 

REQUEST BODY
1. type - `bank`

`None`(not implemented yet)


2. type - `wallet`
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the wallet you will like to transfer from.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            amount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to add to transfer.</span>
        </td>
    </tr>
    <tr>
        <td>
            receiverId
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Mongo ID of the user you will like to add to transfer to.</span>
        </td>
    </tr>
</table>


### POST `/wallet/withdrawal`
Withdraw funds from a user's wallet.

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency pf the wallet you will like to withdraw from.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            amount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to withdraw from the wallet.</span>
        </td>
    </tr>
</table>

### POST `/wallet/swap`
Swap funds between wallets.

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the wallet you will like to send funds from.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            amount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to swap/exchange.</span>
        </td>
    </tr>
    <tr>
        <td>
            outputCurrency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the wallet you will like to send funds to.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
</table>

### POST `/wallet/request`
Request wallet funding from another user.

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency for the wallet you will like to request funds to be sent.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            amount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to request for.</span>
        </td>
    </tr>
    <tr>
        <td>
            creditorId
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Mongo ID of the user you will like to request funding from.</span>
        </td>
    </tr>
</table>

### POST /card/create/:type
Create a new card for a user.

REQUEST PARAMS

type - `virtual | physical` 

REQUEST BODY
<table>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency for the new card you will like to create.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
</table>


### GET  /card/detail
Get a user's card details

REQUEST BODY
<table>
    <tr>
        <td>
            id
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) ID of the card.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the card you will like to retreive details for.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            cardType
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Type of the card you will like to fetch details for.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: virtual | physical</span>
        </td>
    </tr>
</table>

### POST /card/fund/:currency
Fund a user's card.

REQUEST PARAMS

currency - `NGN | USD` 


REQUEST BODY
<table>
    <tr>
        <td>
            id
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) ID of the card.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the card you will like to fund.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            cardType
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Type of the card you will like to fund.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: virtual | physical</span>
        </td>
    </tr>
</table>

### GET  /card/transactions/:currency
Get the transactions made on a user's card.

REQUEST PARAMS

currency - `NGN | USD`  


REQUEST BODY
<table>
    <tr>
        <td>
            id
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) ID of the card.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            cardType
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Type of the card you will like to fetch transaction details for.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: virtual | physical</span>
        </td>
    </tr>
</table>

### GET  /deposit/
Get deposits of a user.

REQUEST BODY/PARAMS

`None`

### POST /deposit/new
Create a new deposit for a user.

REQUEST BODY

<table>
    <tr>
        <td>
            duration
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Duration for the deposit.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            rate
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Interest rate for the new deposit per annum.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            currency
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Currency of the new deposit being made.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: NGN | USD</span>
        </td>
    </tr>
    <tr>
        <td>
            depositAmount
        </td>
        <td>
            Number
            <br />
            <span style="font-size: 0.9rem;">(required) Amount you will like to deposit.</span>
            <br />
        </td>
    </tr>
    <tr>
        <td>
            paymentMethod
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Payment method being used for the new deposit.</span>
            <br />
            <span style="font-size: 0.9rem;">Valid values: card | wallet</span>
        </td>
    </tr>
</table>