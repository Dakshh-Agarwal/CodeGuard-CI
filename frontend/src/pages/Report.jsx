import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getReport } from '../api/reviewApi';
import ViolationTable from '../components/ViolationTable';

const Report = () => {
  const { jobId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pollInterval;

    const fetchReport = async () => {
      try {
        const response = await getReport(jobId);
        setReport(response.data);
        
        if (response.data.status === 'COMPLETED' || response.data.status === 'FAILED') {
          setLoading(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error fetching report', error);
        setLoading(false);
        clearInterval(pollInterval);
      }
    };

    fetchReport();
    pollInterval = setInterval(fetchReport, 2000);

    return () => clearInterval(pollInterval);
  }, [jobId]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return { icon: <Clock color="var(--text-muted)" />, text: 'Job Queued', class: 'badge-info' };
      case 'RUNNING': return { icon: <Loader2 className="animate-spin" color="var(--primary)" />, text: 'Analyzing Code...', class: 'badge-info' };
      case 'COMPLETED': return { icon: <CheckCircle2 color="var(--success)" />, text: 'Analysis Finished', class: 'badge-success' };
      case 'FAILED': return { icon: <XCircle color="var(--error)" />, text: 'Analysis Failed', class: 'badge-error' };
      default: return { icon: null, text: status, class: '' };
    }
  };

  if (!report) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  const statusInfo = getStatusDisplay(report.status);

  return (
    <div className="container animate-fade-in">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Editor
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Analysis Report</h2>
          <p style={{ color: 'var(--text-muted)' }}>Job ID: {jobId}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
          {statusInfo.icon}
          <span style={{ fontWeight: 600 }}>{statusInfo.text}</span>
        </div>
      </div>

      {report.status === 'COMPLETED' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Violations</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: report.totalViolations > 0 ? 'var(--error)' : 'var(--success)' }}>
              {report.totalViolations}
            </p>
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Language</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize' }}>{report.language}</p>
          </div>
          <div className="card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Time Taken</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>
              {report.completedAt ? (new Date(report.completedAt) - new Date(report.submittedAt)) / 1000 : '0'}s
            </p>
          </div>
        </div>
      )}

      {report.status === 'COMPLETED' && <ViolationTable violations={report.violations} />}
      
      {report.status === 'FAILED' && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', border: '1px solid var(--error)' }}>
          <XCircle size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Analysis Failed</h3>
          <p style={{ color: 'var(--text-muted)' }}>Something went wrong while processing your code. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default Report;
