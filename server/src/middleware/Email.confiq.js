import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "tarun08531234@gmail.com",
      pass: "mkpx loul vjrd cogg",
    },
  });

//   const SendEmail=async()=>{
//     try {
//         const info = await transporter.sendMail({
//             from: '"FilmFlix Review" <tarun08531234@gmail.com>', // sender address
//             to: "tarun08532610@gmail.com", // list of receivers
//             subject: "Hello ✔", // Subject line
//             text: "Hello world?", // plain text body
//             html: "<b>Hello world?</b>", // html body
//           });
//           console.log("inf",info)
//     } catch (error) {
//         console.log("error",error)
//     }
//   }

//   SendEmail()