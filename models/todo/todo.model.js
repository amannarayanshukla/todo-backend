const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema, model } = mongoose;
const TodoSchema = new Schema(
  {
    todoId: { type: String },
    userId: { type: String },
    title: { type: String },
    completed: { type: Boolean, default: false },
    url: { type: String },
    order: { type: Number },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TodoSchema.index({ todoId: 1 });
TodoSchema.index({ userId: 1 });
TodoSchema.index({ order: 1 });

TodoSchema.plugin(mongoosePaginate);
TodoSchema.plugin(AutoIncrement, {inc_field: 'order',start_seq: 0, inc_amount: 1024});

module.exports = model('Todos', TodoSchema);
