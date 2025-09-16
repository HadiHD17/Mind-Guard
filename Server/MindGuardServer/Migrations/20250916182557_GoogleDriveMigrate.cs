using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class GoogleDriveMigrate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Outcomes");

            migrationBuilder.AddColumn<bool>(
                name: "DriveInboxEnabled",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "GoogleDriveFolderId",
                table: "Users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "DriveInboxEnabled", "GoogleDriveFolderId", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 16, 18, 25, 57, 145, DateTimeKind.Utc).AddTicks(9006), true, null, "AQAAAAIAAYagAAAAEJInaczGLUFOUKOtQ0cH3K2MrSRoyeArOZw2/2HuK10G8Hjts0C3AWNTWQu8aDzU0A==", new DateTime(2025, 9, 16, 18, 25, 57, 145, DateTimeKind.Utc).AddTicks(9017) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DriveInboxEnabled",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GoogleDriveFolderId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "Outcomes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntryId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsCrisis = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Outcomes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Outcomes_Journal_Entries_EntryId",
                        column: x => x.EntryId,
                        principalTable: "Journal_Entries",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Outcomes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 12, 7, 42, 50, 879, DateTimeKind.Utc).AddTicks(2578), "AQAAAAIAAYagAAAAEKb/OAPzAgRCPNNCVjfyAGGckDOIvOPsw/BstIb9pWc2tpaW1HDrwXjqR366DowNQA==", new DateTime(2025, 9, 12, 7, 42, 50, 879, DateTimeKind.Utc).AddTicks(2589) });

            migrationBuilder.CreateIndex(
                name: "IX_Outcomes_EntryId",
                table: "Outcomes",
                column: "EntryId");

            migrationBuilder.CreateIndex(
                name: "IX_Outcomes_UserId",
                table: "Outcomes",
                column: "UserId");
        }
    }
}
