using Daily_Status_Report_task.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository.IRepository
{
    public interface IStatusRepository
    {
        IEnumerable<StatusTable> GetAllReports();
        StatusTable GetReportById(int id);
        void CreateReport(StatusTable report);
        void UpdateReport(StatusTable report);
        void DeleteReport(int id);
    }
}
