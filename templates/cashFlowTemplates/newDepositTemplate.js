exports.newDepositTemplate = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/woman-investing-getting-profit_74855-11229.jpg?w=1060&t=st=1683355390~exp=1683355990~hmac=b921106c5b5c06a651eb8cb222b3a3a2ab9071e5d0393d8db925e5c2704a44e0'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>Thank you for making a new deposit. Make your money work for you!</p>
        <p>These are the details of your deposit:</p>
        <table style="width: 90%;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td>Currency</td>
                    <td>Amount</td>
                    <td>Rate</td>
                    <td>Returns</td>
                    <td>Payback Date</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td>{{ content.currency }}</td>
                    <td>{{ content.amount }}</td>
                    <td>{{ content.rate }}</td>
                    <td>{{ content.returns }}</td>
                    <td>{{ content.paybackDate }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
`