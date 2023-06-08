using Daily_Status_Report_task.Data;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ApplicationDbContext _context;
        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void CreateDepartment(DepartmentTable department)
        {
            _context.DepartmentTables.Add(department);
            _context.SaveChanges();
        }

        public void DeleteDepartment(int id)
        {
            var departmentInDb = _context.DepartmentTables.FirstOrDefault(s => s.Id == id && !s.Is_Deleted);
            if (departmentInDb != null)
                _context.Remove(departmentInDb);
            _context.SaveChanges();
        }

        public IEnumerable<DepartmentTable> GetAllDepartments()
        {
            return _context.DepartmentTables.ToList();
        }

        public DepartmentTable GetDepartmentById(int id)
        {
            return _context.DepartmentTables.FirstOrDefault(r => r.Id == id);
        }

        public void UpdateDepartment(DepartmentTable department)
        {
            _context.DepartmentTables.Update(department);
            _context.SaveChanges();
        }
    }
}
