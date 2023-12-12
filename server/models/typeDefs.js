const typeDefs = `
    input BookInput {
        title: String
        description: String
        authors: [String]
        image: String
        link: String
        bookId: String
    }

    type Book {
        title: String
        description: String
        authors: [String]
        image: String
        link: String
        bookId: String
    }

    type User {
        username: String
        email: String
        savedBooks: [Book]
    }

    type UserAuthResponse {
        token: String
        user: User
    }

    type Query {
        currentUser: User
        loginUser(email: String, password: String): UserAuthResponse
    }

    type Mutation {
        createUser(username: String, email: String, password: String): UserAuthResponse
        saveBook(book: BookInput): User
        deleteBook(bookId: String): User
    }

`;

module.exports = typeDefs;