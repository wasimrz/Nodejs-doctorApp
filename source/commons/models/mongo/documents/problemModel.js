const mongoose = require('mongoose')
const problemSchema = new mongoose.Schema({
    problemName :String,
    description :String,
    icons:[String],
    displayName :String,
    createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: Date,
}) 
module.exports = mongoose.model('problem',problemSchema);