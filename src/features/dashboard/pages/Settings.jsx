import React, { useState } from "react";

export default function Settings() {
  const [username, setUsername] = useState("Admin");
  const [email, setEmail] = useState("wellwigen@gmail.com");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Preferences</h2>
        <div className="flex flex-col sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="text-gray-700">Enable Notifications</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="text-gray-700">Enable Dark Mode</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}