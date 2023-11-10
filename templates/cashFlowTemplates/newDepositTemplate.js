exports.newDepositTemplate = `
<div style="background-color: #F7F9FC; padding: 40px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/woman-investing-getting-profit_74855-11229.jpg?w=1060&t=st=1683355390~exp=1683355990~hmac=b921106c5b5c06a651eb8cb222b3a3a2ab9071e5d0393d8db925e5c2704a44e0'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>Thank you for making a new deposit. Make your money work for you!</p>
        <p>These are the details of your deposit:</p>
        <table style="width: 90%; border-collapse: collapse; margin-left: auto; margin-right: auto;">
            <thead style="background-color: blue; color: white;">
                <tr>
                    <td style="padding: 0.5rem;">Currency</td>
                    <td style="padding: 0.5rem;">Amount</td>
                    <td style="padding: 0.5rem;">Rate</td>
                    <td style="padding: 0.5rem;">Returns</td>
                    <td style="padding: 0.5rem;">Payback Date</td>
                </tr>
            </thead>
            <tbody style="background-color: aliceblue;">
                <tr>
                    <td style="padding: 0.5rem;">{{ content.currency }}</td>
                    <td style="padding: 0.5rem;">{{ content.amount }}</td>
                    <td style="padding: 0.5rem;">{{ content.rate }}</td>
                    <td style="padding: 0.5rem;">{{ content.returns }}</td>
                    <td style="padding: 0.5rem;">{{ content.paybackDate }}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
</div>
`