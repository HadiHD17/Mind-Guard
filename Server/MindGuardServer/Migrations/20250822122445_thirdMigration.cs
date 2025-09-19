using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class thirdMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 12, 24, 44, 554, DateTimeKind.Utc).AddTicks(5752), "AQAAAAIAAYagAAAAEPstuQOeSONaIIcECwZS7yNj1mTJl+5JHxmEejquMYGnlRj7tY9IRzJD89NFKmF0xg==", new DateTime(2025, 8, 22, 12, 24, 44, 554, DateTimeKind.Utc).AddTicks(5757) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 21, 20, 39, 13, 686, DateTimeKind.Utc).AddTicks(330), "AQAAAAIAAYagAAAAEJeNcDirLbInuE3DzGRoO7T/DzsCO0zh1Cp0MS0LlYOg3eYl8SYITXkszGTCcp4k6w==", new DateTime(2025, 8, 21, 20, 39, 13, 686, DateTimeKind.Utc).AddTicks(333) });
        }
    }
}
