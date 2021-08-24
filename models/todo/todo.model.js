const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const TodoSchema = new Schema(
    {
        todoId: {type: String},
        text: { type: String },
        isCompleted: {type: Boolean,default:false},
        isArchived: {type:Boolean,default:false}
    },
    { timestamps: true },
);

TodoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Todos', TodoSchema);
