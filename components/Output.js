import React from 'react';
import { marked } from 'marked';
import './Output.css'; // Import the CSS file

const Output = ({ rawMarkdown }) => {
  const getFormattedContent = () => {
    return { __html: marked(rawMarkdown) };
  };

  return (
    <div className="markdown-preview">
      <div dangerouslySetInnerHTML={getFormattedContent()} />
    </div>
  );
};

export default Output;
