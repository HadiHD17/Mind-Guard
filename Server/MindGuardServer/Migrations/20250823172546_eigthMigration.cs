using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class eigthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sentiment_Score",
                table: "Journal_Entries",
                newName: "SentimentScore");

            migrationBuilder.RenameColumn(
                name: "Detected_Emotion",
                table: "Journal_Entries",
                newName: "DetectedEmotion");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 17, 25, 45, 773, DateTimeKind.Utc).AddTicks(1693), "AQAAAAIAAYagAAAAEK9zjS4gV7m1Lp835Vu9kVi8R4OeKdbeuLYoNZEsVdHP2PJe3Jq8HugdeLvlYro56g==", new DateTime(2025, 8, 23, 17, 25, 45, 773, DateTimeKind.Utc).AddTicks(1698) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SentimentScore",
                table: "Journal_Entries",
                newName: "Sentiment_Score");

            migrationBuilder.RenameColumn(
                name: "DetectedEmotion",
                table: "Journal_Entries",
                newName: "Detected_Emotion");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 22, 21, 43, 11, 883, DateTimeKind.Utc).AddTicks(4293), "AQAAAAIAAYagAAAAEIVEr69lrHOBmTtJU38fC66WSRoO21ZG5P2tReLj5TKgzysDuY5oU8UF6QA7Xy3ilA==", new DateTime(2025, 8, 22, 21, 43, 11, 883, DateTimeKind.Utc).AddTicks(4299) });
        }
    }
}
