using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models
{
    public class RoleTable
    {
        public int Id { get; set; }
        public string Role_Name { get; set; }
        public bool Is_Deleted { get; set; }
    }
}
