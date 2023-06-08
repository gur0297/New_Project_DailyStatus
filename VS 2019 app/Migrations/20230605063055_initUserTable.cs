using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Daily_Status_Report_task.Migrations
{
    public partial class initUserTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserTableId",
                table: "StatusTables",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "User_Id",
                table: "StatusTables",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserTables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email_Register_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Is_Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTables", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StatusTables_UserTableId",
                table: "StatusTables",
                column: "UserTableId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusTables_UserTables_UserTableId",
                table: "StatusTables",
                column: "UserTableId",
                principalTable: "UserTables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusTables_UserTables_UserTableId",
                table: "StatusTables");

            migrationBuilder.DropTable(
                name: "UserTables");

            migrationBuilder.DropIndex(
                name: "IX_StatusTables_UserTableId",
                table: "StatusTables");

            migrationBuilder.DropColumn(
                name: "UserTableId",
                table: "StatusTables");

            migrationBuilder.DropColumn(
                name: "User_Id",
                table: "StatusTables");
        }
    }
}
