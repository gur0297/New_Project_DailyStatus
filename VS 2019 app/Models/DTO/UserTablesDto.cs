using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models.DTO
{
    public class UserTablesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Email_Register_Date { get; set; }
        public int Department_Id { get; set; }
        public int Role_Id { get; set; }
    }
}
