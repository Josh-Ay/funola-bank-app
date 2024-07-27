exports.verificationMailHtmlContent = `
<div style="background-color: #F7F9FC; padding: 20px 10px;">
<div class="content" style="width: 90%; text-align: center; padding: 20px; margin-top: 20px; margin-bottom: 20px; margin-left: auto; margin-right: auto; border-radius: 10px; background-color: #FFF; box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;">
    <h2>{{title}}</h2>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-29825.jpg?w=1060&t=st=1682370079~exp=1682370679~hmac=338d373b03fb1c1c12b51700527756697cb9f7a68eeb2da48b82f1eab654ce17'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p style='font-size: 1rem;'>Hello {{name}},</p>
        <p>Thank you for signing up to Funola!</p>
        <br />
        <p>
            Kindly finish up your account setup by clicking the button below: 
        </p>
        <button
            style='
                border: none;
                outline: none;
                background: none;
            '
        >
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
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                '
                href="{{ content }}"
                target='_blank' 
                rel='noreferrer noopener'
            >
                Verify Account
            </a>
        </button>
    </div>
</div>
</div>
`;
