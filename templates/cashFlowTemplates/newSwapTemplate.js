exports.newSwapTemplate = `
<div style="background-color: #F7F9FC; padding: 40px;">
<div class="content" style="width: 75%; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/flat-people-holding-euro-dollar-coins-currency-exchange_88138-568.jpg?w=1060&t=st=1687697847~exp=1687698447~hmac=db5c36a531f815ca3921c36888d2bb0722b355b0ba0f073a6b4fc4156771f4e2'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>Your swap was successful.</p>
        <p>These are the details of your swap:</p>
        <table style="width: 75%; border-collapse: collapse;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td style='padding: 0.5rem;'>Amount Debited</td>
                    <td style='padding: 0.5rem;'>Currency Debited</td>
                    <td style='padding: 0.5rem;'>Amount Credited</td>
                    <td style='padding: 0.5rem;'>Currency Credited</td>
                    <td style='padding: 0.5rem;'>Rate</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td style='padding: 0.5rem;'>{{ content.amount }}</td>
                    <td style='padding: 0.5rem;'>{{ content.currency }}</td>
                    <td style='padding: 0.5rem;'>{{ content.amountReceived }}</td>
                    <td style='padding: 0.5rem;'>{{ content.currencyReceived }}</td>
                    <td style='padding: 0.5rem;'>{{ content.rate }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
</div>
`
