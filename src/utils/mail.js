import Mailgen from "mailgen";
import nodemailer from "nodemailer";


/* here sendeamil will look like : 
  await sendEmail({
  email: "user@example.com",
  subject: "Welcome to Task Manager",
  mailgenContent: {
    body: {
      name: "User",
      intro: "Welcome to Task Manager! We're glad to have you.",
      outro: "Need help? Contact our support team."
    }
  }
});   */

const sendEmail = async (option) => {

    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
    
            name: 'Task Maneger',
            link: 'https://taskmanager.app'
            
        }
    });

    const emailHTML = mailGenerator.generate(option.mailgenContent);
    const emailTextual  = mailGenerator.generatePlaintext(option.mailgenContent);
    
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
      
        },
      });

      const mailOption = {
        from:  process.env.MAILTRAP_SENDEREMAIL, // We can name this anything. The mail will go to your Mailtrap inbox
        to: option.email,
        subject: option.subject,
        text: emailTextual,
        html: emailHTML
      }

      try {

        await transporter.sendMail(mailOption);
        
      } catch (error) {
        console.error("error occured while sending email", error)
      }
}


const  emailVerificationMailgenContent = (username , varificationURL) => {
    return {
        body : {
            name: username,
            intro: 'Welcome to Task Maneger! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Task Maneger, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: varificationURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
        
}

const  forgotPasswordMailgenContent = (username , PasswordResetURL) => {
    return {
        body : {
            name: username,
            intro: 'We got a request to reset the password of our accoun',
            action: {
                instructions: 'To Reset you Password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset you Password',
                    link: PasswordResetURL
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
        
}


export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent
}