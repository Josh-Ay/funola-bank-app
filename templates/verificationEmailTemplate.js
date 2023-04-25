exports.verificationMailHtmlContent = `
<div class="content">
    <h4>{{title}}</h4>
    <div class="body">
        <img 
            src='https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-29825.jpg?w=1060&t=st=1682370079~exp=1682370679~hmac=338d373b03fb1c1c12b51700527756697cb9f7a68eeb2da48b82f1eab654ce17'
            alt='freepik illustration'
            style='max-width: 100%; width: 45%;'
        />
        <p>Thank you for signing up to Yoola!</p>
        <br />
        <p>
            Kindly finish up your account setup by using this link to verify: 
            <a href={{content}} target='_blank' rel='noreferrer noopener'>Verify account</a>
        </p>
    </div>
</div>
`;
