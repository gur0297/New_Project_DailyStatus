using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models
{
    public class UserTable
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Email_Register_Date { get; set; }
        [Display(Name = "Department")]
        public int Department_Id { get; set; }
        [ForeignKey("Department_Id")]
        public DepartmentTable DepartmentTable { get; set; }
        [Display(Name = "Role")]
        public int Role_Id { get; set; }
        [ForeignKey("Role_Id")]
        public RoleTable RoleTable { get; set; }
        public bool Is_Deleted { get; set; }
        [NotMapped]
        public string Token { get; set; }
        public bool PasswordChangeStatus { get; set; }
    }
}
