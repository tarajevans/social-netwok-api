const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
       
   },
    email: {
        type:String,
        unique: true,
        required: true,
        userEmail: mongoose.Schema.Types.email,
   }, 
   thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
   friends: [this],
},
{
    toJSON: {
      //getters: true,
      virtual: true,
    }
  });

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});


const User = mongoose.model('User', UserSchema);

module.exports = User;