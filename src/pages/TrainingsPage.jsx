import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const TrainingsPage = () => {
  return (
    <ContentListingsPage
      title="Training"
      endpoint="/api/trainings"
      deleteEndpoint="/api/trainings" // Adjust if your delete route is different
      detailPageBasePath="/trainings/details"
    />
  );
};

export default TrainingsPage;
