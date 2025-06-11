import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const JobsPage = () => {
  return (
    <ContentListingsPage
      title="Job"
      endpoint="/api/placements" // Jobs data fetched from /api/placements
      deleteEndpoint="/api/placements"
      detailPageBasePath="/jobs/details" // CORRECTED: This will generate links like /jobs/details/:id
    />
  );
};

export default JobsPage;
