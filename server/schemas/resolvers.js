// import User and Book models from "models"
const { User, Book } = require("../models");
// import signToken function from "auth"
const {signToken} = require("../utils/auth");
// function for throwing authentication error when needed within Apollo Server environment
const {AuthenticationError} = require("apollo-server-express");

// create functions for fulfilling queries specified in "typeDefs.js"
const resolvers = {

    Query: {
        me: async (parent, args, context) => {

            if (context.user) {
                return User.findOne({_id: context.user._id})
            }

            throw new AuthenticationError('User with this Id cannot be found.')
        }
    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            // User created with three required arguments
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return {token, user};
        }
    },

    login: async (parent, { email, password }) => {
        const loginUser = await User.findOne({email});

        if (!loginUser) {
            throw new AuthenticationError('Login failed. Cannot find this user');
        }

        const pw = await User.isCorrectPassword(password);

        if (!pw) {
            throw new AuthenticationError('Incorrect password.');
        }

        const token = signToken(loginUser);
        return (token, loginUser)
    },

    saveBook: async (parent, args, context, chosenSavedBook) => {
        const bookData = chosenSavedBook.variableValues.chosenSavedBook;
        const updatedUser = await User.findOneandUpdate(
            {_id: context.user._id},
            {$addtoSet: {savedBooks: bookData}},
            {new: true}
        );
        console.log('updatedUser value: ', updatedUser)
        return updatedUser;
    },

    removeBook: async (parent, args, context) => {
        const updatedUser = await User.findOneAndUpdate(
            {_id: context.user._id},
            {$pull: {savedBooks: {bookId: args.bookId}}},
            {new: true}
        );
        return updatedUser;
    }
}

module.exports = resolvers;