#!/bin/bash
# Exit immediately if a command fails.
set -e

echo "--- Database is healthy. Proceeding with migrations and seeding... ---"

# Set the password variable for sqlcmd
export SQLCMDPASSWORD=$DB_PASSWORD

# --- 1. Run Entity Framework Migrations ---
echo "--- Applying Entity Framework migrations... ---"
dotnet ef database update

# --- 2. Run the Seed Script ---
echo "--- Running seed.sql script... ---"
# THE FIX: Use the correct path for mssql-tools18
/opt/mssql-tools18/bin/sqlcmd \
  -S ${DB_HOST} -U ${DB_USER} -C \
  -d ${DB_NAME} -i /app/seed.sql

# --- 3. Start the .NET Application ---
echo "--- Starting the backend application... ---"
unset SQLCMDPASSWORD
exec dotnet /app/bin/Release/net9.0/backend.dll