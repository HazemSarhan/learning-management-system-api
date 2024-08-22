require('dotenv').config();
const { MailtrapClient } = require('mailtrap');

const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: 'mailtrap@demomailtrap.com',
  name: 'LMS-API',
};

module.exports = { mailtrapClient, sender };
