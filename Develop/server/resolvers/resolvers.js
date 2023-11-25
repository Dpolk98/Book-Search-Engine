const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { GraphQLError } = require('graphql');

// const resolvers = {
//   Query: {
//     schools: async () => {
//       // Populate the classes and professor subdocuments when querying for schools
//       return await School.find({}).populate('classes').populate({

//         path: 'classes',
//         populate: 'professor'
//       });
//     },
//     classes: async () => {
//       // Populate the professor subdocument when querying for classes
//       return await Class.find({}).populate('professor');
//     },
//     professors: async () => {
//       return await Professor.find({});
//     }
//   }
// };

const resolvers = {
  Query: {
    currentUser: async (_parent, args, contextValue) => {
      return User.findById(contextValue.user._id);
    },
    loginUser: async (_parent, args, contextValue) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new GraphQLError('Wrong email', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 }
          }
        });
      }
      const correctPw = await user.isCorrectPassword(args.password)
      if (!correctPw) {
        throw new GraphQLError('Wrong password!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 }
          }
        });
      }
      
      const token = signToken(user);

      return { token, user };
    },
  },
  
  
  Mutation: {
    createUser: async (_parent, args, contextValue) => {
      const user = await User.create(args);

      if (!user) {
        throw new GraphQLError('Something is wrong!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 }
          }
        });
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_parent, args, contextValue) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: contextValue.user._id },
          { $addToSet: { savedBooks: args.book } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
      catch (err) {
        console.log(err);
        throw new GraphQLError("Something is Wrong!", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: { status: 400} 
          }
        });
      }
    },
    deleteBook: async (_parent, args, contextValue) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: contextValue.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new GraphQLError("Couldn't find user with this id!", {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 404 }
          }
        });
      }

      return updatedUser 
    }
  },
};

module.exports = resolvers;
