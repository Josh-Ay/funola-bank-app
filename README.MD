# Yoola Banking Application API
The API for the Yoola Banking Application API.

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
- Javasript
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
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/test/status</td>
            <td>GET</td>
            <td>Check that the API is up and working fine.</td>
        </tr>
        <tr>
            <td>/auth/code</td>
            <td>POST</td>
            <td>Send a verification code to a user.</td>
        </tr>
        <tr>
            <td>/auth/verify-code</td>
            <td>POST</td>
            <td>Check the validity of a verification code.</td>
        </tr>
        <tr>
            <td>/auth/register</td>
            <td>POST</td>
            <td>Register a new user.</td>
        </tr>
        <tr>
            <td>/auth/verify</td>
            <td>GET</td>
            <td>Verify a new account.</td>
        </tr>
        <tr>
            <td>/auth/login</td>
            <td>POST</td>
            <td>Login an existing user.</td>
        </tr>
        <tr>
            <td>/auth/request-password-reset</td>
            <td>POST</td>
            <td>Request for a password reset.</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>GET</td>
            <td>Verify a password reset link.</td>
        </tr>
        <tr>
            <td>/auth/reset-password</td>
            <td>POST</td>
            <td>Reset a password for a user.</td>
        </tr>
        <tr>
            <td>/auth/change-password</td>
            <td>POST</td>
            <td>Change the password of an existing user.</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>
