using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addedIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_Users_AddedByLeaderId",
                table: "Vendors");

            migrationBuilder.RenameColumn(
                name: "UpdatedByLeaderId",
                table: "Vendors",
                newName: "UpdatedById");

            migrationBuilder.RenameColumn(
                name: "AddedByLeaderId",
                table: "Vendors",
                newName: "AddedById");

            migrationBuilder.RenameIndex(
                name: "IX_Vendors_AddedByLeaderId",
                table: "Vendors",
                newName: "IX_Vendors_AddedById");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Vendors",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AddedById",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Employees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Users_AddedById",
                table: "Users",
                column: "AddedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_AddedById",
                table: "Users",
                column: "AddedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_Users_AddedById",
                table: "Vendors",
                column: "AddedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_AddedById",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_Users_AddedById",
                table: "Vendors");

            migrationBuilder.DropIndex(
                name: "IX_Users_AddedById",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "AddedById",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Employees");

            migrationBuilder.RenameColumn(
                name: "UpdatedById",
                table: "Vendors",
                newName: "UpdatedByLeaderId");

            migrationBuilder.RenameColumn(
                name: "AddedById",
                table: "Vendors",
                newName: "AddedByLeaderId");

            migrationBuilder.RenameIndex(
                name: "IX_Vendors_AddedById",
                table: "Vendors",
                newName: "IX_Vendors_AddedByLeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_Users_AddedByLeaderId",
                table: "Vendors",
                column: "AddedByLeaderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
