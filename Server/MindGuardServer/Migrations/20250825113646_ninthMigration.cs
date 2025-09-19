using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class ninthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE ""Journal_Entries"" 
          ALTER COLUMN ""SentimentScore"" TYPE double precision
          USING ""SentimentScore""::double precision;"
            );
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 11, 36, 45, 985, DateTimeKind.Utc).AddTicks(8619), "AQAAAAIAAYagAAAAEOOsH2uM/HogIrV9tfG3rvvOPIUkC+nstEFw4ntsPmXnqAtEg7+jSkSwjOyvpzJ8WQ==", new DateTime(2025, 8, 25, 11, 36, 45, 985, DateTimeKind.Utc).AddTicks(8626) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SentimentScore",
                table: "Journal_Entries",
                type: "text",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 17, 25, 45, 773, DateTimeKind.Utc).AddTicks(1693), "AQAAAAIAAYagAAAAEK9zjS4gV7m1Lp835Vu9kVi8R4OeKdbeuLYoNZEsVdHP2PJe3Jq8HugdeLvlYro56g==", new DateTime(2025, 8, 23, 17, 25, 45, 773, DateTimeKind.Utc).AddTicks(1698) });
        }
    }
}
