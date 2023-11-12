exports.resetPasswordHtmlContent = `
<div style="background-color: #F7F9FC; padding: 40px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/key-concept-illustration_114360-6305.jpg?w=740&t=st=1682385005~exp=1682385605~hmac=ceb2788553a6b610a5b176109dcb190efddd661d4bd5cc75326fa9f63be3854a'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem'>Hello {{name}},</p>
        <p>You requested to reset your password on Funola. If this was not you, kindly ignore this email and contact customer support.</p>
        <br />
        <p>
            Kindly use this button below to reset your password: 
        </p>
        <a 
            href={{content}} 
            target='_blank' 
            rel='noreferrer noopener'
            style='
                display: block;
                text-align: center;
                padding: 0.7rem 0;
                text-decoration: none;
                background: #2573d5;
                color: #fff;
                width: 8rem;
                border-radius: 8px;
                margin-left: auto;
                margin-right: auto;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
            '
        >
            Reset password
        </a>
    </div>
</div>
</div>
`;
