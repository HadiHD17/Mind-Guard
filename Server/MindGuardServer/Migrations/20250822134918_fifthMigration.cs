using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class fifthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 13, 49, 17, 690, DateTimeKind.Utc).AddTicks(2422), "AQAAAAIAAYagAAAAENVxutDrGe6stmMgZu1OIIJsScTAoZx2ya2RbKan79yhXhcJ7Tu4LmpZQGmkrHJiSQ==", new DateTime(2025, 8, 22, 13, 49, 17, 690, DateTimeKind.Utc).AddTicks(2427) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 12, 28, 59, 803, DateTimeKind.Utc).AddTicks(2873), "AQAAAAIAAYagAAAAENOAWYHtXqv9DarfkgbvqNX3rWFmEHKaRGpXSPOAP3e3zFlZ5C+9zHhUKfFvjBq5Gw==", new DateTime(2025, 8, 22, 12, 28, 59, 803, DateTimeKind.Utc).AddTicks(2878) });
        }
    }
}
