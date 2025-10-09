# Use a single-stage build based on the SDK image for development.
FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

# --- Install prerequisites first ---
USER root
RUN apt-get update && apt-get install -y curl gpg \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev

# Install the dotnet-ef tool to a global, system-wide location.
RUN dotnet tool install dotnet-ef --tool-path /usr/local/bin

# --- Copy and build the application ---
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build -c Release

# --- Set up the entrypoint script ---
COPY ./seed.sql /app/seed.sql
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# THE FIX: Change the ownership of all files in /app to the 'app' user.
# The 'app' user and group are created by default in the .NET SDK image.
RUN chown -R app:app /app

# Switch to the default non-root user
USER app

# The entrypoint will now be our custom script
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]