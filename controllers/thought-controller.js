const { Thought, User } = require('../models');

const thoughtController = {

getAllThoughts(req, res) {
    Thought.find({})
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},
      
getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
        if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this Id!' });
        return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
},

createThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
    .then(({_id}) => {
        return User.findOnAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this Id!'});
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this Id!' });
          return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
},
  

deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this Id!' });
        return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
},

createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true}
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this Id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate({
      _id: req.params.thoughtId}, 
        {$pull: {reactions: {ReactionId: req.params.reactionId}}},
        {new: true} 
    )
      .then(dbThoughtsData => {
          if (!dbThoughtsData) {
              res.status(404).json({message: 'No thoughts found with this ID!'});
              return;
          }
        res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err));
},

};

module.exports = thoughtController;








// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
// // example data
// {
//   "thoughtText": "Here's a cool thought...",
//   "username": "lernantino",
//   "userId": "5edff358a0fcb779aa7b118b"
// }