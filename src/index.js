const express = require('express')
const {v4: uuidv4} = require('uuid') //8.3k (gzipped: 3.5k)
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const users = []


const check_Repeated_Username = ((req, res, next) => {
    const { username } = req.body
    const hasUsername = users.some(user => user.username === username.trim())

    if(hasUsername)
    {
        return res.status(400).json({error:"já existe este usuário"})
    }
    next()
})

const check_If_Username_Exists = ((req, res, next) => {
    const { username } = req.headers
    const hasUsername = users.find(user => user.username === username.trim())

    if(!hasUsername)
    {
        return res.status(404).json({error:"Usuário não existente"})
    }
    req.user = hasUsername
    next()
})

app.post('/users', check_Repeated_Username, (req, res) => {
    const { name, username } = req.body

    const user = {
        id: uuidv4(), 
        name: name,
        username: username.trim(),
        todos: []}
    users.push(user)
    return res.status(201).json(user)
})

app.get('/todos',check_If_Username_Exists, (req, res) => {

    const userReturn = {
        username: req.user.username,
        todos: req.user.todos
    }
    
    return res.status(200).json(
        userReturn
    )
})

app.post('/todos', check_If_Username_Exists, (req, res) => {
    const { title, deadline } = req.body
    const id = uuidv4()
    const todo = {
        id: id,
        title: title,
        done: false,
        deadline: new Date(deadline),
        created_At: new Date()
    }
    req.user.todos.push(todo)
    res.status(201).json(todo)

})

app.put('/todos/:id', check_If_Username_Exists,(req, res) => {
    const { title, deadline } = req.body
    const id = req.user.todos.map(todo => {
        if(todo.id === req.params.id) {
            todo.title = title
            todo.deadline = new Date(deadline)
            const todoChanged = todo
            return res.status(201).json(todoChanged)
        }
    })

    if(!id) {
        return res.status(404).json({error: "id não encontrado"})
    }
})

app.patch('/todos/:id/done', check_If_Username_Exists, (req, res) => {
    const id = req.user.todos.map(todo => {
        if(todo.id === req.params.id) {
            todo.done = true
            const todoChanged = todo
            console.log(users)
            console.log(users.todos)
            return res.status(201).json(todoChanged)
        }
    })

    if(!id) {
        return res.status(404).json({error: "id não encontrado"})
    }
})

app.delete('/todos/:id', check_If_Username_Exists,(req, res) => {
    const id = req.user.todos.map((todo, index) => {
        if(todo.id === req.params.id) {
            console.log(user.todos)
            user.todos.splice(index, 1)
            const todoChanged = todo

            return res.status(201).json(todoChanged)
        }
    })

    return res.status(404).json({error: "id não encontrado"})
})

/*
const cpfVerify = ((req, res, next) => {
    const cpf = req.params.cpf
    const customerExists = customers.find(customer => customer.cpf === cpf)
        if(!customerExists) { 
            return res.status(400).json({error: "não existe"})
        }
        req.cpf = cpf
        req.customer = customerExists
        next()
    })


app.post('/account', (req, res) => {
    const {cpf, nome} = req.body

    const customerExists = customers.some(customer => customer.cpf === cpf)

    if(customerExists) { 
        return res.status(400).json({error: "ja existe"})
    }

    const id = uuidv4()
    customers.push({
        nome: nome,
        cpf: cpf,
        id: id,
        saldo: 0,
        dataCriacao: (new Date().toString()),
        statement: []}
        )
    return res.send(customers)
})

app.get('/statement/:cpf', cpfVerify, (req, res) => {
    return res.status(200).json(req.customer.statement)
})

app.get('/account/saldo/:cpf', cpfVerify, (req, res) => {
    return res.status(200).json(req.customer.saldo)
})

app.put('/account/deposito/:cpf', cpfVerify, (req, res) => {
  
    req.customer.saldo = req.customer.saldo + parseInt(req.body.deposito)
    return res.status(200).json(req.customer)
})

app.put('/account/saque/:cpf', cpfVerify, (req, res) => {
  
    req.customer.saldo = req.customer.saldo - parseInt(req.body.saque)
    return res.status(200).json(req.customer)
})
*/

app.listen(3000)