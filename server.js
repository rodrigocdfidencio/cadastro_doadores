//Configurar o servidor
const express = require("express")
const server = express()

//Configurando o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do form
server.use(express.urlencoded({extended: true}))

//configurar a conexão com o BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '811264',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true
})


//Configurar a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function (err, result){
        if(err) return res.send(("Erro de BD"))
        const donors = result.rows
        return res.render('index.html', {donors})
    })
    
})

server.post("/", function(req, res){
    //Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os camos são obrigatórios.")
    }
    
    //colocar valores no bd
    
    const query = `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")
        //fluxo ideal
        return res.redirect('/')
    })

    
})

//Ligar o server e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor")
})

