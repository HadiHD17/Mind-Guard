FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Copy project files first for better caching
COPY ["MindGuardServer.Tests/MindGuardServer.Tests.csproj", "MindGuardServer.Tests/"]
COPY ["MindGuardServer/MindGuardServer.csproj", "MindGuardServer/"]

# Restore dependencies
RUN dotnet restore "MindGuardServer.Tests/MindGuardServer.Tests.csproj"

# Copy source code
COPY MindGuardServer.Tests/ MindGuardServer.Tests/
COPY MindGuardServer/ MindGuardServer/

# Build and run tests
ENTRYPOINT ["dotnet", "test", "MindGuardServer.Tests/MindGuardServer.Tests.csproj", "--logger:trx"]