import { Editor } from '@monaco-editor/react';
import { Box } from '@razorpay/blade/components';
import React from 'react';
import { COBALT_THEME } from 'src/components/Generic/CodeEditor/theme';

const CodeEditor = ({ code, isSmallEditor = false }) => {
  const editValues = {
    height: isSmallEditor ? '40px' : '500px',
    borderWidth: isSmallEditor ? '1px' : '10px',
  };

  function setEditorTheme(monaco) {
    monaco.editor.defineTheme('onedark', COBALT_THEME);
  }

  return (
    <Box width="100%">
      <Editor
        {...editValues}
        width="100%"
        beforeMount={setEditorTheme}
        theme="onedark"
        defaultLanguage={isSmallEditor ? 'string' : 'json'}
        value={code}
        options={{ minimap: { enabled: false } }}
      />
    </Box>
  );
};

export default CodeEditor;
