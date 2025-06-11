import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const WorkshopsPage = () => {
  return (
    <ContentListingsPage
      title="Workshop"
      endpoint="/api/workshops"
      deleteEndpoint="/api/workshops" // Adjust if your delete route is different
      detailPageBasePath="/workshops/details"
    />
  );
};

export default WorkshopsPage;