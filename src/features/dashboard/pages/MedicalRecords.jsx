import React from "react";

const medicalRecordsData = [];

export default function MedicalRecords() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Medical Records</h1>

      {/* Medical Records Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Diagnosis</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Prescription</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Doctor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicalRecordsData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                  No medical records on file yet.
                </td>
              </tr>
            ) : (
              medicalRecordsData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{record.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{record.patient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.diagnosis}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.prescription}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.doctor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Record
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
          Export Records
        </button>
      </div>
    </div>
  );
}