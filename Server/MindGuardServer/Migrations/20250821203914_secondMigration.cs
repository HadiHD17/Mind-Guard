using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class secondMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Calendar_sync_enabled", "CreatedAt", "Email", "FullName", "IsDark", "Password", "PhoneNumber", "UpdatedAt" },
                values: new object[] { -1, true, new DateTime(2025, 8, 21, 20, 39, 13, 686, DateTimeKind.Utc).AddTicks(330), "hadi@gmail.com", "Hadi Haidar", true, "AQAAAAIAAYagAAAAEJeNcDirLbInuE3DzGRoO7T/DzsCO0zh1Cp0MS0LlYOg3eYl8SYITXkszGTCcp4k6w==", "81918422", new DateTime(2025, 8, 21, 20, 39, 13, 686, DateTimeKind.Utc).AddTicks(333) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1);
        }
    }
}
