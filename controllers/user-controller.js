const User = require('../models/User');

const userController = {

getAllUsers(req, res) {
    User.find({})
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},
        
getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
        if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

createUser({ params, body }, res) {
    console.log(body);
    User.create(body)
    .then(({_id}) => {
        return User.findOnAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!'});
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },


deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
        if (!dbUserData) {
        res.status(404).json({ message: 'No User found with this id!' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},
addFriend({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.Id },
      { $push: { friends: body } },
      { new: true, runValidators: true}
    )
      .then(dbFriendData => {
        if (!dbFriendData) {
          res.status(404).json({ message: 'No user found with this Id!' });
          return;
        }
        res.json(dbFriendData);
      })
      .catch(err => res.json(err));
  },

  deleteFriend(req, res) {
    User.findOneAndUpdate({
      _id: req.params.Id}, 
        {$pull: {friends: {$in: req.params.friendId}}},
        {new: true} 
    )
      .then(dbFriendData => {
          if (!dbFriendData) {
              res.status(404).json({message: 'No user found with this ID!'});
              return;
          }
        res.json(dbFriendData);
    })
    .catch(err => res.status(400).json(err));
},

};

module.exports = userController;