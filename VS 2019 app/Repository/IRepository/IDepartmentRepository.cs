using Daily_Status_Report_task.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository.IRepository
{
    public interface IDepartmentRepository
    {
        IEnumerable<DepartmentTable> GetAllDepartments();
        DepartmentTable GetDepartmentById(int id);
        void CreateDepartment(DepartmentTable department);
        void UpdateDepartment(DepartmentTable department);
        void DeleteDepartment(int id);
    }
}
