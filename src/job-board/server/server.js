import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
// apply the Apollo middleware to the Express app
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

// read the schema from the file system
const typeDefs = await readFile('./schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
// all requests to /graphql are now handled by Apollo Server
app.use('/graphql', apolloMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
	console.log(`🚀 Server ready at ${PORT}`);
	console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
