import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Code2 } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import { submitCode } from '../api/reviewApi';

const Home = () => {
  const [code, setCode] = useState('public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}');
  const [language, setLanguage] = useState('java');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await submitCode(code, language);
      navigate(`/report/${response.data.jobId}`);
    } catch (error) {
      alert('Error submitting code. Is the backend running?');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CodeGuard CI
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Real-time static analysis for your Java code snippets.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Code2 color="var(--primary)" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.4rem' }}
            >
              <option value="java">Java</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
          >
            <Play size={18} />
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>

        <CodeEditor value={code} onChange={setCode} language={language} />
      </div>
    </div>
  );
};

export default Home;
