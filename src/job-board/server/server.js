import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
// apply the Apollo middleware to the Express app
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

// read the schema from the file system
const typeDefs = await readFile('./schema.graphql', 'utf-8');

const getContext = async ({ req }) => {
	const companyLoader = createCompanyLoader();
	// put the data loader on the context object
	const context = { companyLoader };
	if (req.auth) {
		context.user = await getUser(req.auth.sub);
	}
	return context;
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
// all requests to /graphql are now handled by Apollo Server
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
	console.log(`🚀 Server ready at ${PORT}`);
	console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
