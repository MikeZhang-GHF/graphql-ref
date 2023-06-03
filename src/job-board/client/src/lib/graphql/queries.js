import {
	ApolloClient,
	ApolloLink,
	gql,
	concat,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });
// authLink is a middleware that adds the access token to the request's headers
const authLink = new ApolloLink((operation, forward) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		operation.setContext({
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});
	}
	return forward(operation);
});

// Setup Apollo Client
export const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
	fragment JobDetail on Job {
		id
		title
		date
		company {
			id
			name
		}
		description
	}
`;

export const companyByIdQuery = gql`
	query CompanyQuery($id: ID!) {
		company(id: $id) {
			id
			name
			description
			jobs {
				id
				date
				title
			}
		}
	}
`;

export const jobByIdQuery = gql`
	query JobQuery($id: ID!) {
		job(id: $id) {
			...JobDetail
		}
	}
	${jobDetailFragment}
`;

export const jobsQuery = gql`
	query Jobs {
		jobs {
			id
			title
			date
			company {
				id
				name
			}
		}
	}
`;

export const createJobMutation = gql`
	mutation CreateJob($input: CreateJobInput!) {
		job: createJob(input: $input) {
			...JobDetail
		}
	}
	${jobDetailFragment}
`;
