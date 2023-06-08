using Microsoft.EntityFrameworkCore.Migrations;

namespace Daily_Status_Report_task.Migrations
{
    public partial class initIs_DeletedinRoleDept : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Is_Deleted",
                table: "RoleTables",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Is_Deleted",
                table: "DepartmentTables",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Is_Deleted",
                table: "RoleTables");

            migrationBuilder.DropColumn(
                name: "Is_Deleted",
                table: "DepartmentTables");
        }
    }
}
