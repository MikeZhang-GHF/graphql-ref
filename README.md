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

#### Query
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
```javascript
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    // anonymouse async function to handle errors
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        setState({ company: null, loading: false, error: true });
      }
    })();
  }, [companyId]);
```

#### Mutations
```javascript
type Mutation {
  createJob(input: CreateJobInput!): Job
}
```
- best practice: use input type
```javascript
input CreateJobInput {
  title: String!
  description: String
}
```
- Use update graphql
```javascript
mutation {
  updateJob(input: {
    id: "YjxZEzdJtXe1", 
    title: "Go Developer", 
    description: "Must be an expert in Goroutine"}) {
    id
    title
    date
    description
  }
}
```
- Subscription
```sh
npm i graphql-ws ws @graphql-tools/schema
```




[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO -     http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [Q]: <https://leetcode.cn/problems/shortest-cycle-in-a-graph/>