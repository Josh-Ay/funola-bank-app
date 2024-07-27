exports.newFundingTemplate = `
<div style="background-color: #F7F9FC; padding: 20px 10px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/digital-wallet-abstract-concept-illustration_335657-3896.jpg?w=740&t=st=1683464277~exp=1683464877~hmac=80ecc1f3088c3d959f0672b7ab90a88b77cdc0eb1654bd828192fd8b89c7953f'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>Your {{ fundingType }} funding was successful.</p>
        <p>These are the details of your deposit:</p>
        <table style="width: 85%; border-collapse: collapse; margin-left: auto; margin-right: auto;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td style='padding: 0.75rem;'>Currency</td>
                    <td style='padding: 0.75rem;'>Amount</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td style='padding: 0.75rem;'>{{ content.currency }}</td>
                    <td style='padding: 0.75rem;'>{{ content.amount }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
</div>
`