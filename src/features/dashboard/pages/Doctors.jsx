import React from "react";

const doctorsData = [];

export default function Doctors() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>

      {/* Doctors Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Specialization</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {doctorsData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-400">
                  No doctors registered yet.
                </td>
              </tr>
            ) : (
              doctorsData.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{doctor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Doctor
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
          Export List
        </button>
      </div>
    </div>
  );
}