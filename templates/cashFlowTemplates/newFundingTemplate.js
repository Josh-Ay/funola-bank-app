exports.newFundingTemplate = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/digital-wallet-abstract-concept-illustration_335657-3896.jpg?w=740&t=st=1683464277~exp=1683464877~hmac=80ecc1f3088c3d959f0672b7ab90a88b77cdc0eb1654bd828192fd8b89c7953f'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>Your {{ fundingType }} funding was successful.</p>
        <p>These are the details of your deposit:</p>
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