### Recomended : Google Chrome + Linux OS.

## Software Features

- Front End : React
- Back End : Python - Flask
- Database : PostgreSQL
- Generate questions based on input using AI ( gemini ).
- No of face detections for cheat analysis.
- Emotion analysis.
- Speech recognition for answering questions.
- AI ( gemini ) generated review based on interview performance including emotion and cheat analysis.
- Responsive Design.

## Database Setup

To set up the database for the Mock Interview System, follow these steps:

### Prerequisites

- Ensure you have PostgreSQL installed and running on your machine.
- Create a new PostgreSQL database and user with the necessary permissions.

### Step-by-Step Instructions

1. **Create a New Database and User**

   Open your PostgreSQL command line or use a database client to create a new database and user:

   ```sql
   CREATE DATABASE your_database_name;
   CREATE USER your_user_name WITH PASSWORD 'your_password';
   ALTER ROLE your_user_name SET client_encoding TO 'utf8';
   ALTER ROLE your_user_name SET default_transaction_isolation TO 'read committed';
   ALTER ROLE your_user_name SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_user_name;
   ```

2. **Configure the Database URL**

   Update the `DATABASE_URL` in `server/config/database.py` and `sqlalchemy.url` in `server/alembic.ini` with your new database credentials:

   ```python
   DATABASE_URL = "postgresql://your_user_name:your_password@localhost/your_database_name"
   ```

3. **Initialize Alembic**

   If you haven't already initialized Alembic, run the following command in your terminal from the `server` directory:

   ```bash
   alembic init migrations
   ```

4. **Apply Migrations**

   Run the following commands to apply the migrations and set up the database schema:

   ```bash
   export PYTHONPATH=$(pwd)
   alembic upgrade head
   ```

   This will apply all the migrations and create the necessary tables in your database.

5. **Verify the Setup**

   Use a database client or command-line tool to verify that the tables have been created in your database.

### Additional Notes

- Ensure your PostgreSQL server is running and accessible.
- If you encounter any issues, check the Alembic logs for more details.
- Make sure the user specified in the `DATABASE_URL` has the necessary permissions to create tables in the database.

By following these steps, you should be able to set up the database for the Interview Kit System successfully.

## Backend Setup

To set up the backend for the Mock Interview System, follow these steps:

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (as configured in the Database Setup section)

### Step-by-Step Instructions

1. **Navigate to the server directory**

   ```bash
   cd server
   ```

2. **Install required Python packages**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Create a `.env` file in the server directory with the following variables:

   ```
   DATABASE_URL=postgresql://your_user_name:your_password@localhost/your_database_name
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Note: The app currently uses a hardcoded Gemini API key for demonstration purposes, but it's recommended to use environment variables for security in production.

4. **Run the Flask server**

   ```bash
   python app.py
   ```

   The server will start running on http://localhost:5000 by default.

## Frontend Setup

To set up the frontend for the Mock Interview System, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

### Step-by-Step Instructions

1. **Navigate to the client directory**

   ```bash
   cd client
   ```

2. **Install required Node.js packages**

   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

3. **Start the React development server**

   ```bash
   npm start
   # or if you use yarn
   yarn start
   ```

   The frontend will start running on http://localhost:3000.

### Additional Notes

- The frontend is built with React and uses various libraries for functionality such as face detection, emotion analysis, and speech recognition.
- For optimal performance, use Google Chrome on a Linux operating system as recommended.
- The application may require camera and microphone permissions to function properly.

## Running the Complete Application

1. Start the PostgreSQL database server
2. Run the Flask backend server
3. Run the React frontend development server
4. Access the application at http://localhost:3000 in your browser
