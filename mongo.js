const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://StackMous:${password}@stackmouscluster.naieb.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=StackMousCluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Print Phonebook
if (!name && !number) {
  console.log('Phonebook')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// Complain about missing number
if (name && !number) {
  console.log(`number missing for ${name}`)
  process.exit(1)
}

// Add new person
if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })
  console.log('Trying to save new person')
  person.save().then(result => {
    console.log(`Added ${name} number ${number} to Phonebook`)
    console.log(`${result}`)
    mongoose.connection.close()
  })
}

