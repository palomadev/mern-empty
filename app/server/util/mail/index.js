const sendgrid = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
require('dotenv').config()
const { SENDGRID_API_KEY } = process.env;
sendgrid.setApiKey(SENDGRID_API_KEY);
const readHTMLFile = path => new Promise(res => fs.readFile(path, { encoding: 'utf-8' }, (err, html) => res(!err ? html : undefined)));

const methods = {
    SendEmail: async (data, templatename) => {
        const html = await readHTMLFile(path.join(__dirname, `/templates/${templatename}.html`));
        const htmlRendered = mustache.render(html, data);
        const to = data.to || ['admin@truekonnect.com', 'alexander.guzman@serpicodev.com'];
        let mailOptions = {
            from: '"TrueKonnect Email Messages" <noreply@truekonnect.com>',
            // to: ['admin@truekonnect.com','alexander.guzman@serpicodev.com'],
            // to: ['Hildegard.wiggenhorn@serpicodev.com','alexander.guzman@serpicodev.com'],
            to,
            subject: data.subject || 'No Subject',
            html: htmlRendered
        };
        
        sendgrid.send(mailOptions).then(e => {
            if (e && e.length > 0) console.log('Message sent: ' + e[0].statusMessage);
            else console.log('Error: ' + e)
        }).catch(console.log);
    },
}
module.exports = methods;