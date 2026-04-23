import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language = 'java' }) => {
  return (
    <div className="card" style={{ height: '500px', padding: '10px', overflow: 'hidden' }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 10, bottom: 10 }
        }}
      />
    </div>
  );
};

export default CodeEditor;
