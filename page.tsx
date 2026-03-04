"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {

  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const login = () => {
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
      setMessage("");
    } else {
      setMessage("Invalid credentials");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setText("");
    setMessage("");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const saveFlow = async () => {

    if (!text.trim()) {
      setMessage("Editor is empty.");
      return;
    }

    localStorage.setItem("flowguard_context", text);

    try {

      setLoading(true);

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: text }),
      });

      const data = await res.json();
      setMessage(data.summary);

    } catch {
      setMessage("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  const resumeFlow = () => {

    const saved = localStorage.getItem("flowguard_context");

    if (saved) {
      setText(saved);
      setMessage("Flow restored 🔁");
    } else {
      setMessage("No saved flow found");
    }
  };

  const bg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black";

  const card = darkMode
    ? "bg-black/40 border border-gray-700"
    : "bg-white/80 border border-gray-300";

  // LOGIN PAGE
  if (!loggedIn) {

    return (

      <div className={`min-h-screen flex items-center justify-center ${bg}`}>

        <div className={`${card} backdrop-blur p-10 rounded-2xl shadow-xl w-80 text-center`}>

          <h1 className="text-3xl font-bold mb-6">
            FlowGuard AI
          </h1>

          <input
            className={`w-full p-3 mb-4 rounded-lg outline-none border 
            ${darkMode
              ? "bg-gray-900 text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-black border-gray-400 placeholder-gray-500"}
            focus:ring-2 focus:ring-indigo-500`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className={`w-full p-3 mb-4 rounded-lg outline-none border 
            ${darkMode
              ? "bg-gray-900 text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-black border-gray-400 placeholder-gray-500"}
            focus:ring-2 focus:ring-indigo-500`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg w-full"
          >
            Login
          </button>

          <p className="mt-4 text-red-400">{message}</p>

          <button
            onClick={toggleTheme}
            className="mt-6 text-sm underline opacity-70"
          >
            Toggle Theme
          </button>

          <p className="mt-4 text-xs opacity-60">
            demo: admin / 1234
          </p>

        </div>

      </div>
    );
  }

  // MAIN APP
  return (

    <div className={`min-h-screen ${bg}`}>

      {/* NAVBAR */}

      <div className="flex justify-between items-center p-6 border-b border-gray-700">

        <h1 className="text-3xl font-bold">
          FlowGuard AI
        </h1>

        <div className="flex gap-3">

          <button
            onClick={toggleTheme}
            className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 text-white"
          >
            Theme
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-white"
          >
            Logout
          </button>

        </div>

      </div>


      <div className="p-10 max-w-6xl mx-auto">


        {/* EDITOR */}

        <div className={`${card} backdrop-blur p-6 rounded-2xl shadow-lg`}>

          <Editor
            height="420px"
            defaultLanguage="java"
            theme={darkMode ? "vs-dark" : "light"}
            value={text}
            onChange={(value) => setText(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
            }}
          />

        </div>


        {/* BUTTONS */}

        <div className="flex gap-4 mt-6">

          <button
            onClick={saveFlow}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white shadow"
          >
            {loading ? "Analyzing..." : "Save Flow"}
          </button>

          <button
            onClick={resumeFlow}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white shadow"
          >
            Resume Flow
          </button>

        </div>


        {/* SUMMARY PANEL */}

        <div className={`${card} backdrop-blur mt-6 p-6 rounded-xl shadow`}>

          <h2 className="font-semibold mb-2 text-lg">
            AI Summary
          </h2>

          <p className="text-green-400 whitespace-pre-wrap">
            {message || "Your code summary will appear here."}
          </p>

        </div>

      </div>

    </div>
  );
}