const { Schema, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
ReactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
},
reactionBody: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
},
writtenBy: {
        type: String,
        required: true,
},
createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
}
},
{
    toJSON: {
      getters: true,
      //virtual: true
}
});

module.exports = ReactionSchema;