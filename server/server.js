const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/api', (req, res) => {
    const body = req.body

    !body ? res.status(400).end() : res.status(200).end()

    console.log(body)
})

app.listen(5000, () => {
    console.log('Servidor executando na porta 5000')
})