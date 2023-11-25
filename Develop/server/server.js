const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require("./models/typeDefs.js");
const resolvers = require("./resolvers/resolvers.js");
const { authMiddleware, getAuthUser } = require('./utils/auth.js');


const app = express();
const PORT = process.env.PORT || 3001;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// app.use(express.urlencoded({ extended: true}));
// app.use(express.json());
// app.use(routes);


const startApolloServer = async () => {
  await apolloServer.start();

  app.use(express.json());
  
  //passes user to expressMiddleware from getAuthUser as context
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => getAuthUser(req),
  }));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } 

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
