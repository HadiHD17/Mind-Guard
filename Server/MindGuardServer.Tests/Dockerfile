# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["MindGuardServer.Tests.csproj", "./"]
COPY ["../MindGuardServer/MindGuardServer.csproj", "../MindGuardServer/"]
RUN dotnet restore "MindGuardServer.Tests.csproj"

COPY . .
COPY ../MindGuardServer ../MindGuardServer
RUN dotnet build "MindGuardServer.Tests.csproj" -c Release -o /app/build

FROM build AS final
WORKDIR /app

COPY --from=build /app/build .

ENTRYPOINT ["dotnet", "test", "MindGuardServer.Tests.dll", "--logger:trx"]

