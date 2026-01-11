const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|xlsx|xls|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    console.log(extname, mimetype, file.originalname);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and Excel files are allowed.'));
    }
  }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tax Computation API is running' });
});

// Upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Download file
// app.get('/api/download/:filename', (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const filePath = path.join(uploadsDir, filename);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     res.download(filePath, (err) => {
//       if (err) {
//         res.status(500).json({ error: 'Error downloading file' });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // List all uploaded files
// app.get('/api/files', (req, res) => {
//   try {
//     const files = fs.readdirSync(uploadsDir).map(filename => {
//       const filePath = path.join(uploadsDir, filename);
//       const stats = fs.statSync(filePath);
//       return {
//         filename,
//         size: stats.size,
//         uploadedAt: stats.birthtime,
//         modifiedAt: stats.mtime
//       };
//     });

//     res.json({ files });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete file
// app.delete('/api/files/:filename', (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const filePath = path.join(uploadsDir, filename);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     fs.unlinkSync(filePath);
//     res.json({ message: 'File deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Calculate tax based on income
app.post('/api/calculate-tax', (req, res) => {
  try {
    const { income, filingStatus, deductions = 0 } = req.body;

    if (!income || income < 0) {
      return res.status(400).json({ error: 'Invalid income amount' });
    }

    // Simple tax calculation (can be customized based on tax brackets)
    const taxableIncome = Math.max(0, income - deductions);
    let tax = 0;

    // Example tax brackets (can be customized)
    if (taxableIncome > 500000) {
      tax = (taxableIncome - 500000) * 0.30 + 100000;
    } else if (taxableIncome > 250000) {
      tax = (taxableIncome - 250000) * 0.20 + 25000;
    } else if (taxableIncome > 100000) {
      tax = (taxableIncome - 100000) * 0.10;
    }

    const netIncome = income - tax;

    res.json({
      income,
      filingStatus: filingStatus || 'single',
      deductions,
      taxableIncome,
      tax: Math.round(tax * 100) / 100,
      netIncome: Math.round(netIncome * 100) / 100,
      effectiveRate: income > 0 ? Math.round((tax / income) * 10000) / 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Process Excel file for tax computation
// app.post('/api/process-tax-file', upload.single('file'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const filePath = req.file.path;
//     const fileExt = path.extname(req.file.originalname).toLowerCase();

//     if (!['.xlsx', '.xls'].includes(fileExt)) {
//       return res.status(400).json({ error: 'File must be an Excel file (.xlsx or .xls)' });
//     }

//     // Read Excel file
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet);

//     // Process tax for each row
//     const processedData = data.map((row, index) => {
//       const income = parseFloat(row.income || row.Income || 0);
//       const deductions = parseFloat(row.deductions || row.Deductions || 0);
//       const taxableIncome = Math.max(0, income - deductions);
      
//       let tax = 0;
//       if (taxableIncome > 500000) {
//         tax = (taxableIncome - 500000) * 0.30 + 100000;
//       } else if (taxableIncome > 250000) {
//         tax = (taxableIncome - 250000) * 0.20 + 25000;
//       } else if (taxableIncome > 100000) {
//         tax = (taxableIncome - 100000) * 0.10;
//       }

//       return {
//         ...row,
//         calculatedTax: Math.round(tax * 100) / 100,
//         taxableIncome: Math.round(taxableIncome * 100) / 100,
//         netIncome: Math.round((income - tax) * 100) / 100
//       };
//     });

//     res.json({
//       message: 'File processed successfully',
//       totalRecords: processedData.length,
//       data: processedData,
//       summary: {
//         totalIncome: processedData.reduce((sum, row) => sum + (parseFloat(row.income || row.Income || 0)), 0),
//         totalTax: processedData.reduce((sum, row) => sum + row.calculatedTax, 0),
//         totalDeductions: processedData.reduce((sum, row) => sum + (parseFloat(row.deductions || row.Deductions || 0)), 0)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ error: 'File too large' });
//     }
//   }
//   res.status(500).json({ error: error.message || 'Internal server error' });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

