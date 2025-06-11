import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const InternshipsPage = () => {
  return (
    <ContentListingsPage
      title="Internship"
      endpoint="/api/internships"
      deleteEndpoint="/api/internships"
      detailPageBasePath="/internships/details" // NEW: Path to detail page
    />
  );
};

export default InternshipsPage;

