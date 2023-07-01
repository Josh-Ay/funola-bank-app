exports.verificationMailHtmlContent = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-29825.jpg?w=1060&t=st=1682370079~exp=1682370679~hmac=338d373b03fb1c1c12b51700527756697cb9f7a68eeb2da48b82f1eab654ce17'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
        <p>Thank you for signing up to Funola!</p>
        <br />
        <p>
            Kindly finish up your account setup by clicking the button below: 
        </p>
        <a 
            style='
                display: block;
                text-align: center;
                padding: 0.7rem 0;
                text-decoration: none;
                background: #2573d5;
                color: #fff;
                width: 8rem;
                border-radius: 8px;
            '
            href="{{ content }}"
            target='_blank' 
            rel='noreferrer noopener'
        >
            Verify Account
        </a>
    </div>
</div>
`;
