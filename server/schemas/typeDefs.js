const {gql} = require('apollo-server-express');

const typeDefs = gql`

    type Query {
        me: User
    }

    input saveBookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }

    type Mutation {
        login(email: String! password: String!): Auth
        addUser(username: String! email: String! password: String!): Auth
        saveBook(bookToSave: saveBookInput): User
        removeBook(bookId: String!): User
    }

    type User {
        _id: ID
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        Id: ID
        authors: [String!]
        description: String!
        bookId: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;