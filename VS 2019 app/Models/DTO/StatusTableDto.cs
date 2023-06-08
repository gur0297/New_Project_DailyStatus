using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Models.DTO
{
    public class StatusTableDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public DateTime Date { get; set; }
        public int Hours { get; set; }
        public int Minutes { get; set; }
        public string Success { get; set; }
        public string Obstacle { get; set; }
        public string NextDayPlan { get; set; }
        public int User_Id { get; set; }
        public TaskStatus Status { get; set; }

    }
}
