using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class sixthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 14, 1, 50, 34, DateTimeKind.Utc).AddTicks(571), "AQAAAAIAAYagAAAAEL0qEmg6um555A01jwXMm6G66naj1adr/wmYynMOqvwHT/ihxkyswok42Em8F6Enrg==", new DateTime(2025, 8, 22, 14, 1, 50, 34, DateTimeKind.Utc).AddTicks(579) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 13, 49, 17, 690, DateTimeKind.Utc).AddTicks(2422), "AQAAAAIAAYagAAAAENVxutDrGe6stmMgZu1OIIJsScTAoZx2ya2RbKan79yhXhcJ7Tu4LmpZQGmkrHJiSQ==", new DateTime(2025, 8, 22, 13, 49, 17, 690, DateTimeKind.Utc).AddTicks(2427) });
        }
    }
}
