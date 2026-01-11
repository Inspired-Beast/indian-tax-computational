import { useState } from 'react'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'
import TaxCalculator from './components/TaxCalculator'
import TaxFileProcessor from './components/TaxFileProcessor'

function App() {
  const [activeTab, setActiveTab] = useState('calculator')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tax Computation App
          </h1>
          <p className="text-gray-600">
            Calculate taxes, upload files, and process tax data
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tax Calculator
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              File Upload
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Files
            </button>
            <button
              onClick={() => setActiveTab('processor')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'processor'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Process Tax File
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'calculator' && <TaxCalculator />}
          {activeTab === 'upload' && <FileUpload />}
          {activeTab === 'files' && <FileList />}
          {activeTab === 'processor' && <TaxFileProcessor />}
        </div>
      </div>
    </div>
  )
}

export default App

