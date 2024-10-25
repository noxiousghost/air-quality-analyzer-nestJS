# Air Quality Analyzer

This project is the backend service for an IoT-based air quality monitoring device that measures Kathmandu's air quality on a daily basis. It allows uploading and saving air quality reports, cleaning malformed data, and generating insights on the data.

## Features

- Upload a CSV file and save air quality reports in the database
- Clean malformed data before saving to the database
- View all records in the database, including AQI reports and uploaded files
- Delete uploaded CSV files
- Generate a monthly report including:
  - Average AQI
  - Maximum and Minimum AQI
  - List of daily measured AQI
- Generate a yearly report including:
  - Average AQI
  - Maximum and Minimum AQI

## Technology Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (TypeORM)
- **Environment**: Node.js

## API Endpoints

1. **GET `/api/report/`**  
   Fetches all the air quality records stored in the database.

2. **POST `/api/report/add`**  
   Adds a new air quality record to the database.

   - **Request Body**: `{ aqi: number, day: number, month: string, year: number }`

3. **GET `/api/report/aqi`**  
   Fetches the air quality report for a specific month and year using query parameters.

   - **Example 1: Monthly Report**: `/api/report?month=jan&year=2024`
   - **Response Format**:
     ```json
     {
       "month": "jan",
       "year": 2024,
       "avg": 150,
       "max": 200,
       "min": 50,
       "list": [
         {
           "date": "01/01/2024",
           "aqi": 50
         }
       ]
     }
     ```
   - **Example 2: Yearly Report**: `/api/report?year=2024`
   - **Response Format**:
     ```json
     {
       "year": 2024,
       "avg": 150,
       "max": 200,
       "min": 50
     }
     ```

4. **GET `/api/file/`**  
   Fetches all the uploaded files records stored in the database, including the title and directory of each file.

5. **GET `/api/file/:id`**  
   Fetches details about an uploaded file based on the ID provided.

6. **POST `/api/file/upload`**  
   Adds details about a new file and stores it in disk storage.

   - **Request Body**: `{ title: string, file: File }`

7. **DELETE `/api/file/:id`**  
   Deletes the record of a file and the file itself from disk storage based on the provided ID.

8. **POST `/api/file/process/:id`**  
   Processes the file based on the provided ID and saves its records in the database.

   - **Request Body**: `{}`

## Project Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/noxiousghost/air-quality-analyzer-nestjs.git
   cd air-quality-analyzer-nestjs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Rename `.env.example` to `.env` and configure the environment variables, including PostgreSQL connection details.

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the project:

   ```bash
   npm start
   ```

6. To run in development mode:
   ```bash
   npm run dev
   ```

### Database Setup

1. Ensure PostgreSQL is running, and a database is created as configured in `.env`.
2. Run migrations to set up the database schema:
   ```bash
   npm run typeorm migration:run
   ```

---
