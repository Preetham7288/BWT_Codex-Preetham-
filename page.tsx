"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {

  const [text, setText] = useState("");
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  const bg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black";

  const card = darkMode
    ? "bg-black/40 border border-gray-700"
    : "bg-white/80 border border-gray-300";

  // SIGNUP
  const signup = () => {

    const users = JSON.parse(localStorage.getItem("flowguard_users") || "[]");

    const exists = users.find((u: any) => u.username === username);

    if (exists) {
      setMessage("User already exists");
      return;
    }

    users.push({
      username,
      password,
      files: []
    });

    localStorage.setItem("flowguard_users", JSON.stringify(users));

    setMessage("Account created! Please login.");
    setSignupMode(false);
  };

  // LOGIN
  const login = () => {

    const users = JSON.parse(localStorage.getItem("flowguard_users") || "[]");

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!user) {
      setMessage("Invalid credentials");
      return;
    }

    localStorage.setItem("flowguard_current_user", username);

    setFiles(user.files);

    setLoggedIn(true);
    setMessage("");
  };

  const logout = () => {
    setLoggedIn(false);
    setText("");
    setMessage("");
    setFilename("");
  };

  // DELETE FILE
  const deleteFile = (fileId: number) => {

    const users = JSON.parse(localStorage.getItem("flowguard_users") || "[]");
    const currentUser = localStorage.getItem("flowguard_current_user");

    const user = users.find((u: any) => u.username === currentUser);

    user.files = user.files.filter((f: any) => f.id !== fileId);

    localStorage.setItem("flowguard_users", JSON.stringify(users));

    setFiles(user.files);

    setMessage("File deleted.");
  };

  // SAVE FILE + SUMMARY
  const saveFlow = async () => {

    if (!text.trim()) {
      setMessage("Editor is empty.");
      return;
    }

    if (!filename.trim()) {
      setMessage("Please enter a filename.");
      return;
    }

    const res = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: text }),
    });

    const data = await res.json();

    const users = JSON.parse(localStorage.getItem("flowguard_users") || "[]");
    const currentUser = localStorage.getItem("flowguard_current_user");
    const user = users.find((u: any) => u.username === currentUser);

    const duplicate = user.files.find((f: any) => f.filename === filename);

    if (duplicate) {
      setMessage("File with this name already exists.");
      return;
    }

    const file = {
      id: Date.now(),
      filename,
      code: text,
      summary: data.summary,
      date: new Date().toLocaleString()
    };

    user.files.unshift(file);

    localStorage.setItem("flowguard_users", JSON.stringify(users));

    setFiles(user.files);

    setMessage(data.summary);
  };

  const openFile = (file: any) => {

    setFilename(file.filename);
    setText(file.code);
    setMessage(file.summary);

  };

  // LOGIN PAGE
  if (!loggedIn) {

    return (

      <div className={`min-h-screen flex items-center justify-center ${bg}`}>

        <div className={`${card} backdrop-blur p-10 rounded-2xl shadow-xl w-80 text-center`}>

          <h1 className="text-3xl font-bold mb-6">
            FlowGuard AI
          </h1>

          <input
            className={`w-full p-3 mb-4 rounded-lg border 
            ${darkMode
              ? "bg-gray-900 text-white border-gray-600"
              : "bg-white text-black border-gray-400"}`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className={`w-full p-3 mb-4 rounded-lg border 
            ${darkMode
              ? "bg-gray-900 text-white border-gray-600"
              : "bg-white text-black border-gray-400"}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {signupMode ? (

            <button
              onClick={signup}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg w-full"
            >
              Sign Up
            </button>

          ) : (

            <button
              onClick={login}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg w-full"
            >
              Login
            </button>

          )}

          <p className="mt-4 text-red-400">{message}</p>

          <button
            onClick={() => setSignupMode(!signupMode)}
            className="mt-4 text-sm underline"
          >
            {signupMode ? "Back to Login" : "Create Account"}
          </button>

          <button
            onClick={toggleTheme}
            className="mt-4 text-sm underline opacity-70"
          >
            Toggle Theme
          </button>

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


      <div className="flex p-10 gap-6 max-w-7xl mx-auto">


        {/* FILE HISTORY */}

        <div className={`${card} p-4 rounded-xl w-64 h-[500px] overflow-auto`}>

          <h2 className="font-semibold mb-3">
            File History
          </h2>

          {files.length === 0 && (
            <p className="text-sm opacity-70">No files yet</p>
          )}

          {files.map((file) => (

            <div
              key={file.id}
              className="p-3 mb-2 rounded bg-gray-800 text-sm flex justify-between items-center"
            >

              <div
                onClick={() => openFile(file)}
                className="cursor-pointer flex-1 hover:underline"
              >

                <div className="font-semibold">
                  {file.filename}
                </div>

                <div className="text-xs opacity-70">
                  {file.date}
                </div>

              </div>

              <button
                onClick={() => deleteFile(file.id)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                🗑
              </button>

            </div>

          ))}

        </div>


        {/* EDITOR + SUMMARY */}

        <div className="flex-1">

          <input
            className={`w-full p-3 mb-4 rounded border 
            ${darkMode
              ? "bg-gray-900 text-white border-gray-600"
              : "bg-white text-black border-gray-400"}`}
            placeholder="Enter filename (example: main.java)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />

          <div className={`${card} backdrop-blur p-6 rounded-2xl shadow-lg`}>

            <Editor
              height="350px"
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

          <div className="flex gap-4 mt-6">

            <button
              onClick={saveFlow}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white shadow"
            >
              Save Flow
            </button>

          </div>


          <div className={`${card} backdrop-blur mt-6 p-6 rounded-xl shadow`}>

            <h2 className="font-semibold mb-2 text-lg">
              Summary
            </h2>

            <p className="text-green-400 whitespace-pre-wrap">
              {message || "Summary will appear here"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}