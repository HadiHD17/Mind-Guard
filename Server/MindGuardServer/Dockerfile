FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["MindGuardServer.csproj", "./"]
RUN dotnet restore "MindGuardServer.csproj"

COPY . .
RUN dotnet build "MindGuardServer.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MindGuardServer.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 7138 5224

ENTRYPOINT ["dotnet", "MindGuardServer.dll"]

