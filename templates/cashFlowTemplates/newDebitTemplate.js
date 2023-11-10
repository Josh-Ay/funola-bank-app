exports.newDebitTemplate = `
<div style="background-color: #F7F9FC; padding: 40px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/paper-airplane-doodle_1034-832.jpg?w=740&t=st=1683504059~exp=1683504659~hmac=d32fb8c4205f9692844f2a8f871cccfa4381842fd0a9e2206c38ca7520fcb4aa'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>Your {{ debitType }} was successful.</p>
        <p>These are the details of your {{ debitType }}:</p>
        <table style="width: 50%; border-collapse: collapse; margin-left: auto; margin-right: auto;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td style='padding: 0.5rem;'>Currency</td>
                    <td style='padding: 0.5rem;'>Amount</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td style='padding: 0.5rem;'>{{ content.currency }}</td>
                    <td style='padding: 0.5rem;'>{{ content.amount }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
</div>
`