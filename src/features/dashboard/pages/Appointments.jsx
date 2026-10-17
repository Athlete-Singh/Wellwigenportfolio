import React from "react";

const appointmentsData = [];

export default function Appointments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Doctor</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointmentsData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                  No appointments scheduled yet.
                </td>
              </tr>
            ) : (
              appointmentsData.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{appointment.patient}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{appointment.doctor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.time}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${
                    appointment.status === "Confirmed" ? "text-green-600" :
                    appointment.status === "Pending" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {appointment.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Appointment
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
          Export Schedule
        </button>
      </div>
    </div>
  );
}