using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models
{
    public class StatusTable
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public DateTime Date { get; set; }
        public int Hours { get; set; }
        public int Minutes { get; set; }
        public string Success { get; set; }
        public string Obstacle { get; set; }
        public string NextDayPlan { get; set; }
        public bool Is_Deleted { get; set; }
        [Display(Name = "User")]
        public int User_Id { get; set; }
        [ForeignKey("User_Id")]
        public UserTable UserTable { get; set; }
        public TaskStatus Status { get; set; }
    }
}
