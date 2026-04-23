import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ViolationTable = ({ violations }) => {
  if (!violations || violations.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No violations found! Great job. 🎉</p>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (severity.toUpperCase()) {
      case 'ERROR': return <span className="badge badge-error">Error</span>;
      case 'WARNING': return <span className="badge badge-warning">Warning</span>;
      default: return <span className="badge badge-info">{severity}</span>;
    }
  };

  const getIcon = (severity) => {
    switch (severity.toUpperCase()) {
      case 'ERROR': return <AlertCircle size={18} color="var(--error)" />;
      case 'WARNING': return <AlertTriangle size={18} color="var(--warning)" />;
      default: return <Info size={18} color="var(--info)" />;
    }
  };

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '1rem' }}>Severity</th>
            <th style={{ padding: '1rem' }}>Tool</th>
            <th style={{ padding: '1rem' }}>Line</th>
            <th style={{ padding: '1rem' }}>Rule</th>
            <th style={{ padding: '1rem' }}>Message</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((v, i) => (
            <tr key={v.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getIcon(v.severity)}
                  {getSeverityBadge(v.severity)}
                </div>
              </td>
              <td style={{ padding: '1rem' }}>{v.tool}</td>
              <td style={{ padding: '1rem' }}>{v.lineNumber}</td>
              <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{v.rule}</td>
              <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{v.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViolationTable;
