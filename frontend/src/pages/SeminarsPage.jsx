import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const SeminarsPage = () => {
  return (
    <ContentListingsPage
      title="Seminar"
      endpoint="/api/seminars"
      deleteEndpoint="/api/seminars" // Adjust if your delete route is different
      detailPageBasePath="/seminars/details"
    />
  );
};

export default SeminarsPage;
