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
		createJob: (_root, { input }, { user }) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			return createJob({ companyId: user.companyId, ...input });
		},
		deleteJob: async (_root, { id }, { user }) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			const job = await deleteJob(id, user.companyId);
			if (!job) {
				throw NotFoundError(`No Job found with id : ${id}`);
			}
			return job;
		},
		updateJob: async (_root, { input }, { user }) => {
			if (!user) {
				throw unauthorizedError('Missing authentication');
			}
			const job = await updateJob({ ...input, companyId: user.companyId });
			if (!job) {
				throw NotFoundError(`No Job found with id : ${id}`);
			}
			return job
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

const unauthorizedError = (message) => {
	return new GraphQLError(message, {
		extensions: { code: 'UNAUTHORIZED' },
	});
};

const toISODate = (date) => {
	return date.slice(0, 'yyyy-mm-dd'.length);
};
