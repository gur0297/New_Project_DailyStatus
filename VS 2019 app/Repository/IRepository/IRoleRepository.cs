using Daily_Status_Report_task.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository.IRepository
{
    public interface IRoleRepository
    {
        IEnumerable<RoleTable> GetAllRoles();
        RoleTable GetRoleById(int id);
        void CreateRole(RoleTable role);
        void UpdateRole(RoleTable role);
        void DeleteRole(int id);
    }
}
