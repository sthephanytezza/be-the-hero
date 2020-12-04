require('dotenv').config()

const mailer = require('nodemailer')

const USUARIO = process.env.USUARIO
const SENHA = process.env.SENHA

const config = {
    host: "smtp.mailtrap.io",
    port: 587,
    secure: true,
    service: "gmail",
    auth: {
        user: USUARIO,
        pass: SENHA
    }
}

const transporter = mailer.createTransport(config)

module.exports = {

    send(request, response){
        const {id, email, name } = request.body

     
        const content = {
            from: `Be The Hero <${USUARIO}>`,
            to: email,
            subject: 'Identificação Be The Hero',
            text: `Olá, ${name}. Sua identicação do Be The Hero é ${id}, use-a para logar no sistema. Atenciosamente, equipe Be The Hero.`
        }
    
        transporter.sendMail(content, (error, info) => {
            if(error){
                console.log(error)
                return response.status(500).send('Falha ao enviar email')
            }
    
            return response.status(200).send('Email enviado com sucesso')
        })

    }

}
