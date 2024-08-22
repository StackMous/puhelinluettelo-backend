require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'))
morgan.token('postbody', function (req) { 
    if (req.method === "POST") return JSON.stringify(req.body)
})

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })    
})

app.get('/api/persons/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`);
  })    
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (!person) {
      console.log('no eipä löytynyt')
      response.status(404).send({error: 'person not found'})  
    } else {
      console.log('löytyi että pätkähti')
      response.json(person)
    }
  })
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
    if (body.name && body.number) {
      const person = new Person ({
        name: body.name,
        number: body.number,
      })
      console.log("Trying to save new person")
      person.save().then(result => {
        console.log(`Added ${body.name} number ${body.number} to Phonebook`)
        response.json(person)
      })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})