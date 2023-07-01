exports.resetPasswordHtmlContent = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/key-concept-illustration_114360-6305.jpg?w=740&t=st=1682385005~exp=1682385605~hmac=ceb2788553a6b610a5b176109dcb190efddd661d4bd5cc75326fa9f63be3854a'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Hello {{name}},</p>
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
            '
        >
            Reset password
        </a>
    </div>
</div>
`;
