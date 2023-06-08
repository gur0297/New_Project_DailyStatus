using Daily_Status_Report_task.Data;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository
{
    public class StatusRepository : IStatusRepository
    {
        private readonly ApplicationDbContext _context;
        public StatusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void CreateReport(StatusTable report)
        {
            _context.StatusTables.Add(report);
            _context.SaveChanges();
        }

        public void DeleteReport(int id)
        {
            var statusInDb = _context.StatusTables.FirstOrDefault(s => s.Id == id && !s.Is_Deleted);
            if (statusInDb != null)
                _context.Remove(statusInDb);
            _context.SaveChanges();
        }

        public IEnumerable<StatusTable> GetAllReports()
        {
            return _context.StatusTables.ToList();
        }

        public StatusTable GetReportById(int id)
        {
            return _context.StatusTables.FirstOrDefault(r => r.Id == id);
        }

        public void UpdateReport(StatusTable report)
        {
            _context.StatusTables.Update(report);
            _context.SaveChanges();
        }
    }
}
