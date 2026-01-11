import { useState } from 'react'
import { calculateTax } from '../api/api'

function TaxCalculator() {
  const [formData, setFormData] = useState({
    income: '',
    filingStatus: 'single',
    deductions: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = {
        income: parseFloat(formData.income),
        filingStatus: formData.filingStatus,
        deductions: parseFloat(formData.deductions) || 0,
      }

      const response = await calculateTax(data)
      setResult(response)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tax Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income ($)
          </label>
          <input
            type="number"
            id="income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your annual income"
          />
        </div>

        <div>
          <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Filing Status
          </label>
          <select
            id="filingStatus"
            name="filingStatus"
            value={formData.filingStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="head">Head of Household</option>
          </select>
        </div>

        <div>
          <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-2">
            Deductions ($)
          </label>
          <input
            type="number"
            id="deductions"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter deductions (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate Tax'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tax Calculation Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Gross Income</p>
              <p className="text-2xl font-bold text-gray-800">${result.income.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Deductions</p>
              <p className="text-2xl font-bold text-gray-800">${result.deductions.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Taxable Income</p>
              <p className="text-2xl font-bold text-blue-600">${result.taxableIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Tax Owed</p>
              <p className="text-2xl font-bold text-red-600">${result.tax.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-green-600">${result.netIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="text-sm text-gray-600">Effective Tax Rate</p>
              <p className="text-2xl font-bold text-purple-600">{result.effectiveRate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaxCalculator


