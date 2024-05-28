const mongoose = require('mongoose')

const connectDB = async (url) => {
  await mongoose.connect(url).then(() => {
    console.log('db connected')
  })
}

module.exports = connectDB