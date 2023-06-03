import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import { useState } from 'react';

const JOBS_PER_PAGE = 5;

const HomePage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const { jobs, loading, error } = useJobs(
		JOBS_PER_PAGE,
		(currentPage - 1) * JOBS_PER_PAGE
	);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.log('error:', JSON.stringify(error, null, 2));
		return <div className="has-text-danger">Data unavailable</div>;
	}

	const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

	return (
		<div>
			<h1 className="title">Job Board</h1>
			<button
				disabled={currentPage <= 1}
				onClick={() => setCurrentPage(currentPage - 1)}
			>
				Previous
			</button>
			<span> {`${currentPage} of ${totalPages}`}</span>
			<button
				disabled={currentPage >= totalPages}
				onClick={() => setCurrentPage(currentPage + 1)}
			>
				Next
			</button>
			<JobList jobs={jobs.items} />
		</div>
	);
};

export default HomePage;
