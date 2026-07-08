
// We are creating an **`Email` utility class** to send emails to users.

// We write:
// To automate sending emails like **welcome emails** and **password reset emails** instead of writing email logic repeatedly.

// We use:
// Whenever the application needs to communicate with users through email.

// What does it use?

//Nodemailer → Actually sends the email.

//Pug → Creates beautiful HTML email templates.

//html-to-text → Converts HTML emails into plain text versions for better compatibility.

// ------

//What can it do?

//`sendWelcome()` → Sends a welcome email after registration.

//sendPasswordReset()→ Sends a password reset email with a reset link.

// -----

//Development vs Production

// Development: Use tools like Mailtrap to test emails safely without sending them to real users.
// Production: Use email services like SendGrid to deliver actual emails to customers.

// ---

// > This `Email` class centralizes all email-related tasks, making it easy to send professional emails to users whenever needed.

// > Think of it as the application's digital post office — it prepares the message, chooses the recipient, and delivers important notifications automatically.



const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    // console.log(user);
    console.log(process.env.EMAIL_HOST);
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `OrderIt <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === "production") {
    //   return 1;
    // }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../view/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the Order It!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "password reset token (valid for only 10 minutes)"
    );
  }
};

// mail traps for development
//  this service, you can fake to send emails to clients, but these emails will then never reach these clients, and instead be trapped in your Mailtrap,
// And so that way you cannot accidentally send some development emails to all of your clients or users,

// webside used for dealing emails
// SendGrid provides an SMTP service that allows you to deliver your email via its servers instead of  own client or server
// Make up any email address @mailsac.com and you can instantly receive mail. No need to create the email first! Everything is public, unless you create an account.
