using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class fourthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Sentiment_Score",
                table: "Journal_Entries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Detected_Emotion",
                table: "Journal_Entries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 12, 28, 59, 803, DateTimeKind.Utc).AddTicks(2873), "AQAAAAIAAYagAAAAENOAWYHtXqv9DarfkgbvqNX3rWFmEHKaRGpXSPOAP3e3zFlZ5C+9zHhUKfFvjBq5Gw==", new DateTime(2025, 8, 22, 12, 28, 59, 803, DateTimeKind.Utc).AddTicks(2878) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Sentiment_Score",
                table: "Journal_Entries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Detected_Emotion",
                table: "Journal_Entries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 12, 24, 44, 554, DateTimeKind.Utc).AddTicks(5752), "AQAAAAIAAYagAAAAEPstuQOeSONaIIcECwZS7yNj1mTJl+5JHxmEejquMYGnlRj7tY9IRzJD89NFKmF0xg==", new DateTime(2025, 8, 22, 12, 24, 44, 554, DateTimeKind.Utc).AddTicks(5757) });
        }
    }
}
