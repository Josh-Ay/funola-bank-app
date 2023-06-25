exports.newSwapTemplate = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/flat-people-holding-euro-dollar-coins-currency-exchange_88138-568.jpg?w=1060&t=st=1687697847~exp=1687698447~hmac=db5c36a531f815ca3921c36888d2bb0722b355b0ba0f073a6b4fc4156771f4e2'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>Your swap was successful.</p>
        <p>These are the details of your swap:</p>
        <table style="width: 75%;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td>Amount Debited</td>
                    <td>Currency Debited</td>
                    <td>Amount Credited</td>
                    <td>Currency Credited</td>
                    <td>Rate</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td>{{ content.amount }}</td>
                    <td>{{ content.currency }}</td>
                    <td>{{ content.amountReceived }}</td>
                    <td>{{ content.currencyReceived }}</td>
                    <td>{{ content.rate }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
`
