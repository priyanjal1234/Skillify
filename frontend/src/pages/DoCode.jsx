import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { toast } from "react-toastify";
import codeService from "../services/Code";

const DoCode = () => {
  const [language, setlanguage] = useState("javascript");
  const [code, setcode] = useState("");
  const [output, setoutput] = useState("");

  async function handleRunCode() {
    if (!code) {
      toast.error("Write some code and then run");
      return;
    }

    try {
      let runCodeRes = await codeService.runCode(code, language);
      console.log(runCodeRes)
      setoutput(runCodeRes?.data?.output);
      setcode("");
      setlanguage("javascript");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  function handleCodeChange(value) {
    if (value) {
      setcode(value);
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Editor Section */}
      <div className="w-1/2 border-r border-gray-700">
        <div className="h-12 bg-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-200 font-semibold">Code Editor</h2>
            <select
              value={language}
              onChange={(e) => setlanguage(e.target.value)}
              className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md border border-gray-600 focus:outline-none focus:border-green-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <button
            onClick={handleRunCode}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md transition-colors"
          >
            <Play size={16} />
            Run Code
          </button>
        </div>
        <Editor
          height="calc(100vh - 48px)"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output Section */}
      <div className="w-1/2">
        <div className="h-12 bg-gray-800 flex items-center px-4">
          <h2 className="text-gray-200 font-semibold">Output</h2>
        </div>
        <div className="h-[calc(100vh-48px)] bg-gray-900 p-4">
          <pre className="font-mono text-gray-300 whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default DoCode; 
