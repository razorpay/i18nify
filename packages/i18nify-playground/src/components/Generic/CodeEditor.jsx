import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { Box } from '@razorpay/blade/components';

const CodeEditor = ({ code, isSmallEditor = false }) => {
  const editValues = {
    height: isSmallEditor ? '40px' : '500px',
    borderWidth: isSmallEditor ? '1px' : '10px',
  };

  return (
    <Box width="100%">
      <Editor
        value={code}
        onValueChange={null}
        disabled={true}
        highlight={(code) => highlight(code, languages.js, 'javascript')}
        color="grey"
        inputMode="none"
        preClassName="change"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          padding: '12px',
          height: editValues.height,
          borderRadius: '10px',
          width: '100%',
          border: `${editValues.borderWidth} solid #CBD5E2`,
          overflow: 'auto',
          backgroundColor: 'whitesmoke',
        }}
      />
    </Box>
  );
};

export default CodeEditor;
