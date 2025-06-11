import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const VisitsPage = () => {
  return (
    <ContentListingsPage
      title="Visit"
      endpoint="/api/visits"
      deleteEndpoint="/api/visits" // Adjust if your delete route is different
      detailPageBasePath="/visits/details"
    />
  );
};

export default VisitsPage;
