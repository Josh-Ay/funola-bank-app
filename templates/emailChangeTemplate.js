exports.emailChangeHtmlContent = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/email-campaign-concept-illustration_114360-1681.jpg?w=740&t=st=1682751432~exp=1682752032~hmac=85ed6a5d57d4076292928bad8da9b8a435289fcfe679c2447c533b8a935a0cfa'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>You have successfully changed your email to {{content}} on Yoola. Moving forward, you will no longer receive updates on this email.</p>
        <br />
        <span style='font-size: 0.75rem;'>If this was not you, kindly contact customer support immediately.</span>
    </div>
</div>
`;
