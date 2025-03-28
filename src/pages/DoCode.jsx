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
      setoutput(runCodeRes.data);
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      {/* Editor Section */}
      <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col">
        <div className="h-12 bg-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-200 font-semibold text-sm md:text-base">Code Editor</h2>
            <select
              value={language}
              onChange={(e) => setlanguage(e.target.value)}
              className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md border border-gray-600 focus:outline-none focus:border-green-500 text-xs md:text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <button
            onClick={handleRunCode}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors text-xs md:text-sm"
          >
            <Play size={16} />
            Run Code
          </button>
        </div>
        <Editor
          height="100%"
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
          className="flex-grow"
        />
      </div>

      {/* Output Section */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="h-12 bg-gray-800 flex items-center px-4">
          <h2 className="text-gray-200 font-semibold text-sm md:text-base">Output</h2>
        </div>
        <div className="flex-grow bg-gray-900 p-4 overflow-auto">
          <pre className="font-mono text-gray-300 whitespace-pre-wrap text-xs md:text-sm">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default DoCode;
