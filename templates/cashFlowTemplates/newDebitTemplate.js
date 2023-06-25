exports.newDebitTemplate = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/paper-airplane-doodle_1034-832.jpg?w=740&t=st=1683504059~exp=1683504659~hmac=d32fb8c4205f9692844f2a8f871cccfa4381842fd0a9e2206c38ca7520fcb4aa'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>Your {{ debitType }} was successful.</p>
        <p>These are the details of your {{ debitType }}:</p>
        <table style="width: 50%;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td>Currency</td>
                    <td>Amount</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td>{{ content.currency }}</td>
                    <td>{{ content.amount }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
`