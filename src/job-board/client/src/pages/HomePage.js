import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';

const HomePage = () => {
	const { jobs, loading, error } = useJobs();

	if (loading) {
		return <div>Loading...</div>;
	}	
	if (error) {
		console.log('error:', JSON.stringify(error, null, 2));
		return <div className="has-text-danger">Data unavailable</div>;	
	}

	return (
		<div>
			<h1 className="title">Job Board</h1>
			<JobList jobs={jobs} />
		</div>
	);
};

export default HomePage;
