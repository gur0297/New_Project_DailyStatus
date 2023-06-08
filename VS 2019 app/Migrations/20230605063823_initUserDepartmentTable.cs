using Microsoft.EntityFrameworkCore.Migrations;

namespace Daily_Status_Report_task.Migrations
{
    public partial class initUserDepartmentTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Department_Id",
                table: "UserTables",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Role_Id",
                table: "UserTables",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DepartmentTables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Department_Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentTables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleTables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Role_Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleTables", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserTables_Department_Id",
                table: "UserTables",
                column: "Department_Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserTables_Role_Id",
                table: "UserTables",
                column: "Role_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTables_DepartmentTables_Department_Id",
                table: "UserTables",
                column: "Department_Id",
                principalTable: "DepartmentTables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTables_RoleTables_Role_Id",
                table: "UserTables",
                column: "Role_Id",
                principalTable: "RoleTables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTables_DepartmentTables_Department_Id",
                table: "UserTables");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTables_RoleTables_Role_Id",
                table: "UserTables");

            migrationBuilder.DropTable(
                name: "DepartmentTables");

            migrationBuilder.DropTable(
                name: "RoleTables");

            migrationBuilder.DropIndex(
                name: "IX_UserTables_Department_Id",
                table: "UserTables");

            migrationBuilder.DropIndex(
                name: "IX_UserTables_Role_Id",
                table: "UserTables");

            migrationBuilder.DropColumn(
                name: "Department_Id",
                table: "UserTables");

            migrationBuilder.DropColumn(
                name: "Role_Id",
                table: "UserTables");
        }
    }
}
