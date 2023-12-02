const express = require('express')
const app = express()

const admin = require("firebase-admin")

const credentials = require("./key.json")

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore()

const port = 3000

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
})

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.post('/create', async(request, response) => {
    try{
        const user = {
            nome: request.body.nome,
            email: request.body.email,
            cpf: request.body.cpf
        }
        db.collection("usuarios").add(user)
        response.send("usuario cadastrado com sucesso")
    } catch(error) {
        response.send(error.message)
    }

})