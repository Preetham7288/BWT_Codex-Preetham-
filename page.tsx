"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  // Save flow + send code to AI
  const saveFlow = async () => {
    localStorage.setItem("flowguard_context", text);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: text }),
      });

      const data = await res.json();

      if (data.summary) {
        setMessage(data.summary);
      } else {
        setMessage("Flow saved successfully 🚀");
      }
    } catch (error) {
      setMessage("Flow saved, but AI summary failed.");
    }
  };

  // Restore saved code
  const resumeFlow = () => {
    const saved = localStorage.getItem("flowguard_context");

    if (saved) {
      setText(saved);
      setMessage("Flow restored 🔁");
    } else {
      setMessage("No saved flow found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-6">FlowGuard AI</h1>

      <div className="w-full max-w-4xl">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={text}
          onChange={(value) => setText(value || "")}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={saveFlow}
          className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
        >
          Save Flow
        </button>

        <button
          onClick={resumeFlow}
          className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
        >
          Resume Flow
        </button>
      </div>

      <p className="mt-6 text-center max-w-xl">{message}</p>
    </div>
  );
}