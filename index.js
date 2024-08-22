require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'))

morgan.token('postbody', function (req) { 
    if (req.method === "POST") return JSON.stringify(req.body)
})

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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      console.log('löytyi että pätkähti')
      response.json(person)
    } else {
      console.log('no eipä löytynyt')
      response.status(404).send({error: 'person not found'})  
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})