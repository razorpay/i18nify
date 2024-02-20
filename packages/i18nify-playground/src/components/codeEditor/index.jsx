import { Editor } from '@monaco-editor/react';

const CodeEditor = ({ value }) => {
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="json"
      value={value}
      options={{ minimap: { enabled: false } }}
    />
  );
};

export default CodeEditor;
