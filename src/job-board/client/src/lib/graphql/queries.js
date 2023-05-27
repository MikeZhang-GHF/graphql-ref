import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export const getJobs = async () => {
	const query = gql`
		query {
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

	const { jobs } = await client.request(query);
	return jobs;
};

//  Get a single job by id
export const getJob = async (id) => {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        date
        description
      }
    }
  `;
  const { job } = await client.request(query, { id });
  return job;
}

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
  const { company } = await client.request(query, { id });
  return company;
}
