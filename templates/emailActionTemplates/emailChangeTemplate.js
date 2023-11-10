exports.emailChangeHtmlContent = `
<div style="background-color: #F7F9FC; padding: 40px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/email-campaign-concept-illustration_114360-1681.jpg?w=740&t=st=1682751432~exp=1682752032~hmac=85ed6a5d57d4076292928bad8da9b8a435289fcfe679c2447c533b8a935a0cfa'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>You have successfully changed your email to {{content}} on Funola. Moving forward, you will no longer receive updates on this email.</p>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
</div>
`;
