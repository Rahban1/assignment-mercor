
import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for a chart */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Hiring Funnel</h2>
            <div className="flex items-center justify-center h-64 bg-muted rounded-md">
              <p className="text-muted-foreground">Chart will be here</p>
            </div>
          </div>
          {/* Placeholder for another chart */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diversity Report</h2>
            <div className="flex items-center justify-center h-64 bg-muted rounded-md">
              <p className="text-muted-foreground">Chart will be here</p>
            </div>
          </div>
          {/* Placeholder for key metrics */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground">Average Time to Hire</p>
                <p className="text-2xl font-bold">32 days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Applicants</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hired Candidates</p>
                <p className="text-2xl font-bold">56</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
