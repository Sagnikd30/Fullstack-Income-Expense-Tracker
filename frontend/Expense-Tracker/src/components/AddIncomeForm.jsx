import React, { useState } from "react";

const AddIncomeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "", 
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Income Source</label>
        <input
          type="text"
          name="source"
          placeholder="Freelance, Salary, etc"
          value={formData.source}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
        Add Income
      </button>
    </form>
  );
};

export default AddIncomeForm;
