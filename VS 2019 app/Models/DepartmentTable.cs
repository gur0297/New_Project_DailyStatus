using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models
{
    public class DepartmentTable
    {
        public int Id { get; set; }
        public string Department_Name { get; set; }
        public bool Is_Deleted { get; set; }
    }
}
