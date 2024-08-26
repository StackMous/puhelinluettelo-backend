const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    // ignore result
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        if (v.length < 8) return false
        if (!v.includes('-')) return false
        const splitted = v.split('-')
        if (splitted[0].length < 2 || splitted[0].length > 3) return false
        if (splitted[1].length < 4) return false
        if (!/^\d+$/.test(splitted[0])) return false
        if (!/^\d+$/.test(splitted[1])) return false
        return true
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)