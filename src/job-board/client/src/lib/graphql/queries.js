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
const apolloClient = new ApolloClient({
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

export const getJobs = async () => {
	const query = gql`
		query Jobs {
			jobs {
				id
				title
				company {
					id
					name
				}
				date
			}
		}
	`;
	const {
		data: { jobs },
	} = await apolloClient.query({
		query,
		fetchPolicy: 'network-only',
	});
	return jobs;
};

//  Get a single job by id
export const getJob = async (id) => {
	const query = gql`
		query JobQuery($id: ID!) {
			job(id: $id) {
				...JobDetail
			}
		}
		${jobDetailFragment}
	`;
	const {
		data: { job },
	} = await apolloClient.query({
		query,
		variables: { id },
	});
	return job;
};

export const getCompany = async (id) => {
	const query = gql`
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
	// const { company } = await client.request(query, { id });
	const {
		data: { company },
	} = await apolloClient.query({
		query,
		variables: { id },
	});
	return company;
};

export const createJob = async (input) => {
	const mutation = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
				...JobDetail
			}
		}
		${jobDetailFragment}
	`;
	// const { job } = await client.request(mutation, { input });
	const {
		data: { job },
	} = await apolloClient.mutate({
		mutation,
		variables: { input },
	});
	return job;
};
