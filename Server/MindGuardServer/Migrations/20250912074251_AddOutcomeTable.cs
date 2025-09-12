using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MindGuardServer.Migrations
{
    /// <inheritdoc />
    public partial class AddOutcomeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "LastCompletedDate",
                table: "Routines",
                type: "date",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Outcomes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    EntryId = table.Column<int>(type: "integer", nullable: true),
                    IsCrisis = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Outcomes");

            migrationBuilder.DropColumn(
                name: "LastCompletedDate",
                table: "Routines");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1,
                columns: new[] { "CreatedAt", "Password", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 11, 36, 45, 985, DateTimeKind.Utc).AddTicks(8619), "AQAAAAIAAYagAAAAEOOsH2uM/HogIrV9tfG3rvvOPIUkC+nstEFw4ntsPmXnqAtEg7+jSkSwjOyvpzJ8WQ==", new DateTime(2025, 8, 25, 11, 36, 45, 985, DateTimeKind.Utc).AddTicks(8626) });
        }
    }
}
