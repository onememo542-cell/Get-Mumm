FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["GetMumm.sln", "./"]
COPY ["GetMumm.Api/GetMumm.Api.csproj", "GetMumm.Api/"]
COPY ["GetMumm.Application/GetMumm.Application.csproj", "GetMumm.Application/"]
COPY ["GetMumm.Domain/GetMumm.Domain.csproj", "GetMumm.Domain/"]
COPY ["GetMumm.Infrastructure/GetMumm.Infrastructure.csproj", "GetMumm.Infrastructure/"]
COPY ["GetMumm.Tests/GetMumm.Tests.csproj", "GetMumm.Tests/"]

# Restore dependencies
RUN dotnet restore

# Copy the remaining source code
COPY . .

# Build the application
WORKDIR "/src/GetMumm.Api"
RUN dotnet build "GetMumm.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "GetMumm.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GetMumm.Api.dll"]
