import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const JobFairsPage = () => {
  return (
    <ContentListingsPage
      title="Job Fair"
      endpoint="/api/jobfairs"
      deleteEndpoint="/api/jobfairs" // Adjust if your delete route is different
      detailPageBasePath="/jobfairs/details"
    />
  );
};

export default JobFairsPage;
