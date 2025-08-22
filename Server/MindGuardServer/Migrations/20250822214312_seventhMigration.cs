using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class seventhMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 21, 43, 11, 883, DateTimeKind.Utc).AddTicks(4293), "AQAAAAIAAYagAAAAEIVEr69lrHOBmTtJU38fC66WSRoO21ZG5P2tReLj5TKgzysDuY5oU8UF6QA7Xy3ilA==", new DateTime(2025, 8, 22, 21, 43, 11, 883, DateTimeKind.Utc).AddTicks(4299) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 14, 1, 50, 34, DateTimeKind.Utc).AddTicks(571), "AQAAAAIAAYagAAAAEL0qEmg6um555A01jwXMm6G66naj1adr/wmYynMOqvwHT/ihxkyswok42Em8F6Enrg==", new DateTime(2025, 8, 22, 14, 1, 50, 34, DateTimeKind.Utc).AddTicks(579) });
        }
    }
}
