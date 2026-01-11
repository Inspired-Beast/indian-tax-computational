# Tax Computation App

A full-stack tax computation application with file upload/download capabilities, built with Express.js backend and React frontend.

## Features

- **Tax Calculator**: Calculate taxes based on income, filing status, and deductions
- **File Upload**: Upload files (images, PDFs, Excel files) up to 10MB
- **File Management**: View, download, and delete uploaded files
- **Tax File Processor**: Process Excel files with income and deductions data to calculate taxes in bulk

## Tech Stack

### Backend
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **XLSX** - Excel file processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## Project Structure

```
API_DEV_S1/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   ├── uploads/          # Uploaded files directory (created automatically)
│   └── .env              # Environment variables (create from .env.example)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API client functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to port 5000):
```bash
PORT=5000
```

4. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### File Operations
- `POST /api/upload` - Upload a file
- `GET /api/download/:filename` - Download a file
- `GET /api/files` - List all uploaded files
- `DELETE /api/files/:filename` - Delete a file

### Tax Computation
- `POST /api/calculate-tax` - Calculate tax for individual
  - Body: `{ income: number, filingStatus: string, deductions: number }`
- `POST /api/process-tax-file` - Process Excel file with tax data
  - Body: FormData with `file` field (Excel file with `income` and `deductions` columns)

## Usage

### Tax Calculator
1. Navigate to the "Tax Calculator" tab
2. Enter your annual income
3. Select your filing status
4. Enter deductions (optional)
5. Click "Calculate Tax" to see results

### File Upload
1. Navigate to the "File Upload" tab
2. Select a file (images, PDFs, or Excel files)
3. Click "Upload File"
4. View uploaded files in the "My Files" tab

### Process Tax File
1. Prepare an Excel file with columns: `income` and `deductions`
2. Navigate to the "Process Tax File" tab
3. Upload your Excel file
4. View the processed results with calculated taxes for each row

## Tax Calculation Logic

The app uses a simplified progressive tax system:
- Income up to $100,000: 0% tax
- Income $100,001 - $250,000: 10% tax
- Income $250,001 - $500,000: 20% tax
- Income above $500,000: 30% tax

**Note**: This is a simplified example. In production, you would implement actual tax brackets based on your jurisdiction's tax laws.

## Development

### Backend Development
- Uses nodemon for auto-restart during development
- File uploads are stored in `backend/uploads/` directory
- Supports file types: jpeg, jpg, png, pdf, xlsx, xls, csv

### Frontend Development
- Hot module replacement enabled
- Proxy configured to forward `/api` requests to backend
- Tailwind CSS for styling

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend
```bash
cd backend
npm start
```

## License

ISC


