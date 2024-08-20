const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'))
morgan.token('postbody', function (req) { 
    if (req.method === "POST") return JSON.stringify(req.body)
})

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const MAX_ID = 1000
    const diipa = Math.floor(Math.random() * MAX_ID);
    
    return diipa
}

app.post('/api/persons', (request, response) => {
    app.use(morgan(':method :url :body'))
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }
    if (persons.some(p => p.name === body.name)){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
  
    do {
        newId = generateId()
        console.log(`new id would be ${newId}`)
    } while (
        persons.some(p => p.id === newId)
    )

    console.log(`found new id ${newId}!`)

    const person = {
      name: body.name,
      number: body.number,
      id: newId,
    }
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})