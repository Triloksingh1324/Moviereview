import { transporter } from "./Email.confiq.js";
export const sendVerificationCode=async(email,verficationToken,subject)=>{
    try {
        const info = await transporter.sendMail({
            from: '"FilmFlix Review" <tarun08531234@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: "Code", // plain text body
            html: verficationToken, // html body
          });
          console.log("inf",info)
    } catch (error) {
        console.log("error",error)
    }

}