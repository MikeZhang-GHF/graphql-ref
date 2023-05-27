# GraphQL by Example

**05/27/2023**

## Quick Start

### 0. Install

```bash 
npm install apollo-server graphql
npm i --save-dev nodemon
```
add script in package.json
```json
"scripts": {
  "start": "nodemon index.js"
}
```

### 1. Schema, interface for user
> typeDefs
> type and field: String, Int, Float, Boolean, ID
> Query, Mutation, Subscription

```graphql  
type Query {
  # this is a comment
  hello: String
}
```

### 2. Resolver

```javascript
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
```

### 3. Server

```javascript
const server = new ApolloServer({ typeDefs, resolvers });
```

### 4. Client

```javascript
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});
```

### GraphQL Error
```javascript
const NotFoundError = (message) => {
	return new GraphQLError(message, {
		extensions: { code: 'NOT_FOUND' },
	});
};
```

### Request State
> - Loading
> - Success
> - Error


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO -     http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [Q]: <https://leetcode.cn/problems/shortest-cycle-in-a-graph/>