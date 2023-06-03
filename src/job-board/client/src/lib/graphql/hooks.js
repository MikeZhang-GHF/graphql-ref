import { useQuery, useMutation } from '@apollo/client';
import {
	companyByIdQuery,
	jobByIdQuery,
	jobsQuery,
	createJobMutation,
} from './queries';

// Custom hooks for fetching data from the GraphQL API, hidden from the UI components
// Its a good design pattern to separate the UI components from the data fetching logic
// GraphQL queries are defined in the queries.js file
// useQuery hook caches updates automatically
export const useCompany = (id) => {
	const { data, loading, error } = useQuery(companyByIdQuery, {
		variables: { id },
	});
	return { company: data?.company, loading, error: Boolean(error) };
};

export const useJob = (id) => {
	const { data, loading, error } = useQuery(jobByIdQuery, {
		variables: { id },
	});
	return { job: data?.job, loading, error: Boolean(error) };
};

export const useJobs = () => {
	const { data, loading, error } = useQuery(jobsQuery, {
		fetchPolicy: 'network-only',
	});
	return { jobs: data?.jobs, loading, error: Boolean(error) };
};

export function useCreateJob() {
	const [mutate, { loading }] = useMutation(createJobMutation);

	const createJob = async (title, description) => {
		const {
			data: { job },
		} = await mutate({
			variables: { input: { title, description } },
			// update the cache with the new job
			update: (cache, { data }) => {
				cache.writeQuery({
					query: jobByIdQuery,
					variables: { id: data.job.id },
					data,
				});
			},
		});
		return job;
	};

	return { createJob, loading };
}
