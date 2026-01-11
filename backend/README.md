# Backend API Documentation

## Quick Start

1. Install dependencies: `npm install`
2. Start server: `npm run dev` (development) or `npm start` (production)
3. Server runs on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
  - Returns API status

### File Upload
- **POST** `/api/upload`
  - Upload a file (multipart/form-data)
  - Field name: `file`
  - Supported types: jpeg, jpg, png, pdf, xlsx, xls, csv
  - Max size: 10MB

### File Download
- **GET** `/api/download/:filename`
  - Download a file by filename

### List Files
- **GET** `/api/files`
  - Get list of all uploaded files with metadata

### Delete File
- **DELETE** `/api/files/:filename`
  - Delete a file by filename

### Calculate Tax
- **POST** `/api/calculate-tax`
  - Body:
    ```json
    {
      "income": 100000,
      "filingStatus": "single",
      "deductions": 10000
    }
    ```
  - Returns tax calculation results

### Process Tax File
- **POST** `/api/process-tax-file`
  - Upload Excel file with income and deductions columns
  - Field name: `file`
  - Excel file should have columns: `income` (or `Income`) and `deductions` (or `Deductions`)
  - Returns processed data with calculated taxes

## File Storage

Uploaded files are stored in the `uploads/` directory, which is created automatically on server start.


