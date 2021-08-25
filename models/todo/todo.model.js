const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;
const TodoSchema = new Schema(
  {
    todoId: { type: String },
    title:  { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TodoSchema.plugin(mongoosePaginate);
module.exports = model('Todos', TodoSchema);
