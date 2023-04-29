# Yoola Banking Application API
The API for the Yoola Banking Application API built using the [Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC) design pattern.

Local API Link: `http://localhost:5000`

Live API Link: ``

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
            <th>API Route</th>
            <th>API Function</th>
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
        <tr></tr>
        <tr></tr>
        <tr></tr>
    </tbody>
</table>

### Built with
- Javascript
- Node.js
- Express.js
- MongoDB

### How to run

### Detailed routes description
<table>
    <thead>
        <tr>
            <th>API Route</th>
            <th>METHOD</th>
            <th>API Function</th>
            <th>Request Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/test/status</td>
            <td>GET</td>
            <td>Check that the API is up and working fine.</td>
            <td><a href='#get-teststatus'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/code</td>
            <td>POST</td>
            <td>Send a verification code to a user.</td>
            <td><a href="#post-authcode">Details</a></td>
        </tr>
        <tr>
            <td>/auth/verify-code</td>
            <td>POST</td>
            <td>Check the validity of a verification code.</td>
            <td><a href='#post-authverify-code'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/register</td>
            <td>POST</td>
            <td>Register a new user.</td>
            <td><a href='#post-authregister'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/verify</td>
            <td>GET</td>
            <td>Verify a new account.</td>
            <td><a href='#get-authverify'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/login</td>
            <td>POST</td>
            <td>Login an existing user.</td>
            <td><a href='#post-authlogin'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/request-password-reset</td>
            <td>POST</td>
            <td>Request for a password reset.</td>
            <td><a href='#post-authrequest-password-reset'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>GET</td>
            <td>Verify a password reset link.</td>
            <td><a href='#get-authreset-password'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>PUT</td>
            <td>Reset a password for a user.</td>
            <td><a href='#put-authreset-password'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/change-password</td>
            <td>PUT</td>
            <td>Change the password of an existing user.</td>
            <td><a href='#put-authchange-password'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/refresh-token</td>
            <td>POST</td>
            <td>Refresh a user's access to the api using a token.</td>
            <td><a href='#post-authrefresh-token'>Details</a></td>
        </tr>
        <tr>
            <td>/auth/login-status</td>
            <td>GET</td>
            <td>Confirm a user's access to the api.</td>
            <td><a href='#get-authlogin-status'>Details</a></td>
        </tr>
        <tr>
            <td>/user/profile</td>
            <td>GET</td>
            <td>Get a user's details.</td>
            <td><a href='#get-userprofile'>Details</a></td>
        </tr>
        <tr>
            <td>/update-profile/:updateType</td>
            <td>PUT</td>
            <td>Update a user's details.</td>
            <td><a href='#put-update-profileupdatetype'>Details</a></td>
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
</table>

### POST `/auth/register`
Register a new user.

REQUEST BODY
<table>
    <tr>
        <td>
            name
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) Name of the new user.</span>
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
            <span style="font-size: 0.9rem;">(required) Email of the user you would like to request password reset.</span>
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

### PUT `/update-profile/:updateType`
Update a user's details.

REQUEST PARAMS

updateType - `name | email | profilePhoto ` 

REQUEST BODY
1. updateType - `name`
<table>
    <tr>
        <td>
            name
        </td>
        <td>
            String
            <br />
            <span style="font-size: 0.9rem;">(required) New name you would like to be set for an existing user.</span>
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

3. updateType - `profilePhoto`

