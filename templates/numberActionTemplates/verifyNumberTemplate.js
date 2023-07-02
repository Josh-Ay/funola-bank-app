exports.newVerifyNumberTemplate = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7897.jpg?w=740&t=st=1688275168~exp=1688275768~hmac=fed4047ece471a84c0af19fca6c9bd268fb02db5100248a325eaa28d25721240'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>
            Kindly use the following code to verify your number ({{name}}): 
        </p>
        <p style='font-size: 2rem; letter-spacing: .6rem;'><b>{{ content }}</b></p>
        <span style='font-size: 0.75rem;'>It expires in 5 minutes.</span>
    </div>
</div>
`;
