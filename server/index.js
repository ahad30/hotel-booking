const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const router = require('./src/routes');
const swaggerSpec = require('./src/config/swaggerConfig');
const app = express();
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();


const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://behb-hotel-booking.vercel.app",
    "https://behb-hotel-booking.netlify.app"
  ],
  credentials: true,
  optionSuccessStatus: 200,
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/district', (req, res) => {
  // fetchAndSaveDistricts()
  res.send('Welcome to the Inkspire API!');
});



// Routes
app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  if (res && !res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
});
const axios = require("axios");

async function fetchAndSaveDistricts() {
    console.log("Fetching and saving districts...");
    
    try {
        console.log(1);
        
      // Step 1: Fetch division mapping
      // const localDivisions = await axios.get("http://localhost:5000/api/v1/division");
      // console.log(2, localDivisions);
      
      // const divisionMap = {};
  
      // if (Array.isArray(localDivisions.data?.data)) {
      //   for (const div of localDivisions.data.data) {
      //     divisionMap[div.serialId] = div._id; // external id -> Mongo _id
      //   }
      // }
  
      // Step 2: Fetch districts from external API
      const { data } = await axios.get("https://bdapi.vercel.app/api/v.1/district");
  
      if (Array.isArray(data?.data)) {
        for (const district of data.data) {
          // const divisionId = divisionMap[district.division_id]; // Get MongoDB _id
          // if (!divisionId) {
          //   console.warn(`Division not found for district: ${district.name}`);
          //   continue;
          // }
  
          // Step 3: Insert into your local DB
          await axios.post("http://localhost:5000/api/v1/district/create", {
            serialId: parseInt(district.id),
            name: district.name,
            bn_name: district.bn_name,
            division_id: parseInt(district.division_id), // optional for reference
            // divisionId: divisionId, // this is the actual MongoDB _id to join
          });
  
          console.log(`Saved district: ${district.name}`);
        }
  
        console.log("All districts saved.");
      } else {
        console.log("No districts found in response.");
      }
    } catch (err) {
      console.error("Error fetching or saving districts:", err);
    }
  }
  
// fetchAndSaveDistricts();
// Database connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Start the server only after database connection
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

    // fetchAndSaveDistricts();

  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
})();