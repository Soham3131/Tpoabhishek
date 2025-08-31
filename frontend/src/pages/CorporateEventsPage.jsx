import React from 'react';
import ContentListingsPage from '../components/ContentListingsPage';

const CorporateEventsPage = () => {
  return (
    <ContentListingsPage
      title="Corporate Event"
      endpoint="/api/corporate-events"
      deleteEndpoint="/api/corporate-events"
      detailPageBasePath="/corporate-events/details"
    />
  );
};

export default CorporateEventsPage;