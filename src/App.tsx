
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useHiringStore } from './store';
import { processRawApplicants, normalizeSkills, normalizeSalaryExpectations } from './utils/data-processing';
import Dashboard from './pages/Dashboard';
import SelectionPage from './pages/SelectionPage';
import ReportsPage from './pages/ReportsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  const { loadApplicants, loading } = useHiringStore();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadSampleData() {
      try {
        console.log('Fetching applicant data...');
        const response = await fetch('/applicants.json');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log('Loaded data:', json?.length || 0, 'applicants');
        console.log('First applicant:', json?.[0]);
        setData(json || []);
      } catch (error) {
        console.error('Failed to load applicant data:', error);
        // Try with full URL as fallback
        try {
          console.log('Trying fallback URL...');
          const fallbackResponse = await fetch(`${window.location.origin}/applicants.json`);
          if (fallbackResponse.ok) {
            const fallbackJson = await fallbackResponse.json();
            console.log('Fallback loaded:', fallbackJson?.length || 0, 'applicants');
            setData(fallbackJson || []);
          } else {
            setData([]);
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setData([]);
        }
      }
    }
    loadSampleData();
  }, []);
  

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app with data:', data.length, 'items');
        // Load raw applicant data
        const rawData = data;
        
        if (rawData.length > 0) {
          console.log('Processing applicant data...');
          // Process and validate the data
          const { applicants, errors } = await processRawApplicants(rawData);
          
          console.log('Processed:', applicants.length, 'applicants, errors:', errors.length);
          
          if (errors.length > 0) {
            console.warn('Data processing errors:', errors);
          }
          
          // Normalize the data
          const normalizedApplicants = normalizeSalaryExpectations(
            normalizeSkills(applicants)
          );
          
          console.log('Loading', normalizedApplicants.length, 'normalized applicants into store');
          // Load into store
          loadApplicants(normalizedApplicants);
        } else {
          console.log('No data available, loading empty state');
          // For demo purposes, load empty state
          loadApplicants([]);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadApplicants, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Initializing hiring platform...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Main Dashboard Route */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Candidate Detail Route */}
          <Route 
            path="/candidate/:id" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Candidate Detail</h2>
                  <p className="text-muted-foreground">This page will show detailed candidate information</p>
                </div>
              </div>
            } 
          />
          
          {/* Team Selection Route */}
          <Route 
            path="/selection" 
            element={<SelectionPage />} 
          />
          
          {/* Analytics/Reports Route */}
          <Route 
            path="/reports" 
            element={<ReportsPage />} 
          />
          
          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
