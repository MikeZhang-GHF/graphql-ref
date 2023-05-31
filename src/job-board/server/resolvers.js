import {
	getJobs,
	getJob,
	getJobsByCompany,
	createJob,
	deleteJob,
	updateJob,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
	Query: {
		jobs: () => getJobs(),
		job: async (_root, { id }) => {
			const job = await getJob(id);
			if (!job) {
				throw NotFoundError(`No Job found with id : ${id}`);
			}
			return job;
		},
		company: async (_root, { id }) => {
			const company = await getCompany(id);
			if (!company) {
				throw NotFoundError(`No Company found with id : ${id}`);
			}
			return company;
		},
	},

	Mutation: {
		createJob: (_root, { input }) => {
			const companyId = 'FjcJCHJALA4i';
			return createJob({ companyId, ...input });
		},
		deleteJob: (_root, { id }) => {
			return deleteJob(id);
		},
		updateJob: (_root, { input }) => {
			return updateJob(input);
		},
	},

	Company: {
		jobs: (company) => getJobsByCompany(company.id),
	},

	Job: {
		company: (job) => getCompany(job.companyId),
		date: (job) => toISODate(job.createdAt),
	},
};

const NotFoundError = (message) => {
	return new GraphQLError(message, {
		extensions: { code: 'NOT_FOUND' },
	});
};

const toISODate = (date) => {
	return date.slice(0, 'yyyy-mm-dd'.length);
};
