import React, { useEffect, useState } from "react";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // add error state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/jobs");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setJobs(data.data); // use data.data array here
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error}</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.position}</strong> at {job.company} — {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
