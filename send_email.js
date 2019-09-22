const fs = require("fs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    // to: ['samukim@usp.br','tm_tutui@usp.br', 'luis.fusco@usp.br'],
    to: ['luis.fusco@usp.br'],
    from: 'naoresponda@resistenc.ia',
    subject: 'Relatorio Diario - Áreas de alerta',
    attachments: [{
        content: base64_encode("report.pdf"),
        filename: 'relatorio.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
        contentId: 'mypdf'
    }, ],
};

// function to encode file data to base64 encoded string
function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer.from(bitmap).toString('base64');
}

sgMail.sendMultiple(msg);