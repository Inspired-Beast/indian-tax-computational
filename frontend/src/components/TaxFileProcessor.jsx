import { useState } from 'react'
import { processTaxFile } from '../api/api'

function TaxFileProcessor() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select an Excel file')
      return
    }

    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await processTaxFile(file)
      setResult(response)
    } catch (err) {
      setError(err.response?.data?.error || 'Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Process Tax File</h2>
      <p className="text-gray-600 mb-6">
        Upload an Excel file (.xlsx or .xls) with columns: <strong>income</strong> and <strong>deductions</strong>.
        The system will calculate taxes for each row.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="taxFile" className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="taxFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload Excel file</span>
                  <input
                    id="taxFile"
                    name="taxFile"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">Excel files (.xlsx, .xls) only</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700">Selected File:</p>
            <p className="text-sm text-gray-600">{file.name}</p>
            <p className="text-xs text-gray-500">Size: {formatFileSize(file.size)}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={processing || !file}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? 'Processing...' : 'Process File'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Processing Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-800">{result.totalRecords}</p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${result.summary.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <p className="text-sm text-gray-600">Total Tax</p>
                <p className="text-2xl font-bold text-red-600">
                  ${result.summary.totalTax.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Income
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Taxable Income
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Net Income
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${(row.income || row.Income || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${(row.deductions || row.Deductions || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${row.taxableIncome.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600">
                      ${row.calculatedTax.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      ${row.netIncome.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaxFileProcessor


