import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';


const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(authLink, createHttpLink({ 
  uri: 'http://localhost:9000/graphql',
}));

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
