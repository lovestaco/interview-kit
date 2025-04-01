## <img src="https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/afd19053-6bfd-4100-b859-55cd25bbd66f" alt="Image Alt Text" style="width:27px;" /> Interview Kit

## Visit at https://mock-interview-system-python.vercel.app/

### Note : Due to API limitations, this application only functions properly on the latest browsers such as Google Chrome, Microsoft Edge, etc.

### Recomended : Google Chrome, Desktop Environment.

## Software Features

- Front End : React
- Back End : Python - Flask
- Generate questions based on input using AI ( gemini ).
- No of face detections for cheat analysis.
- Emotion analysis.
- Speech recognition for answering questions.
- AI ( gemini ) generated review based on interview performance including emotion and cheat analysis.
- Responsive Design.

## Preview

### Desktop version

#### Landing Page

![image](https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/80b66b7f-f86e-4ffd-b185-b3f57e4e9a02)

#### Job-Title Input

![image](https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/263c8ffe-79a2-4dc7-9096-48e0043b23b0)

#### Interview Page

![image](https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/03e1d7b1-0405-4827-8841-87d83d7541be)

#### Review Page

![image](https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/618aadb0-5881-4410-a815-e06e9410963b)

### Mobile Version

<img src="https://github.com/MeghanathShetty/Mock-Interview-System-Python/assets/127648939/4d6acbca-6144-4aba-8d4e-3540b308fc9f" alt="Image Alt Text" style="width:300px;" />

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
