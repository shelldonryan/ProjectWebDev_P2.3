const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = require("firebase-admin")

const credentials = require("./key.json")

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore()

const port = 1502

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
})

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

app.delete("/delete/:cpf", async(req, res) => {
    try {
        const cpfUser = req.params.cpf
        const users = db.collection("usuarios")
        const userDoc = await users.where('cpf', '==', cpfUser).get()
        if(userDoc.empty) {
            console.log("documento vazio")
        }

        let idDoc
        
        userDoc.forEach(doc => {
            idDoc = doc.id
        })

        db.collection("usuarios").doc(idDoc).delete()
        res.send("usuario deletado")
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

app.put("/update/:cpf", async (req, res) => {
    try {
        const cpfUser = req.params.cpf
        const users = db.collection("usuarios")
        const userDoc = await users.where('cpf', '==', cpfUser).get()
        if(userDoc.empty) {
            console.log("documento vazio")
        }

        let idDoc
        
        userDoc.forEach(doc => {
            idDoc = doc.id
        })

        const userUp = {
            nome: req.body.nome,
            email: req.body.email,
            cpf: cpfUser
        }

        db.collection("usuarios").doc(idDoc).set(userUp)
        res.send("Usuario atualizado com sucesso")
        console.log("Usuario atualizado com sucesso")
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

app.get("/users", async(req, res) => {
    try {
        const users = db.collection("usuarios")
        const usersDocs = await users.get();
        
        let UsersList = []
        usersDocs.forEach(user => {
            console.log(user.id, '=>', user.data())
            UsersList.push(user.data())
        })

        res.send(UsersList)
        console.log("Usuarios Listados")
    } catch (error) {
        res.send(error.message)
        console.log(error.message)
    }
})

app.get("/userByCpf/:cpf", async(req, res) => {
    try {
        const userCpf = req.params.cpf
        const users = db.collection("usuarios")
        const userDoc = await users.where('cpf', '==', userCpf).get()
        if((userDoc).empty) {
            console.log('Documento vazio')
        } else {
            userDoc.forEach(doc => {
                console.log(doc.id, '=>', doc.data())
                res.send(doc.data())
            })
        }
    
        console.log("Usuario listado")
    } catch (error) {
        res.send(error.message)
        console.log(error.message)
    }
})

app.get("/userById/:id", async(req, res) => {
    try {
        const idDoc = req.params.id

        const userLoc = db.collection("usuarios").doc(idDoc);
        const userDoc = await userLoc.get();

        if(!userDoc.exists) {
            console.log("Documento não existe")
        } else {
            console.log(userDoc.data())
            res.send(userDoc.data())
            console.log("Usuario Listado")
        }
    } catch (error) {
        res.send(error.message)
        console.log(error.message)
    }
})