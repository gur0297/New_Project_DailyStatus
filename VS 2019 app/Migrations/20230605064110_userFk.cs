using Microsoft.EntityFrameworkCore.Migrations;

namespace Daily_Status_Report_task.Migrations
{
    public partial class userFk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusTables_UserTables_UserTableId",
                table: "StatusTables");

            migrationBuilder.DropIndex(
                name: "IX_StatusTables_UserTableId",
                table: "StatusTables");

            migrationBuilder.DropColumn(
                name: "UserTableId",
                table: "StatusTables");

            migrationBuilder.CreateIndex(
                name: "IX_StatusTables_User_Id",
                table: "StatusTables",
                column: "User_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusTables_UserTables_User_Id",
                table: "StatusTables",
                column: "User_Id",
                principalTable: "UserTables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusTables_UserTables_User_Id",
                table: "StatusTables");

            migrationBuilder.DropIndex(
                name: "IX_StatusTables_User_Id",
                table: "StatusTables");

            migrationBuilder.AddColumn<int>(
                name: "UserTableId",
                table: "StatusTables",
                type: "int",
                nullable: true);

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
    }
}
