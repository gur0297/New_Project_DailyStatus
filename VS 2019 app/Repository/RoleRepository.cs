using Daily_Status_Report_task.Data;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void CreateRole(RoleTable role)
        {
            _context.RoleTables.Add(role);
            _context.SaveChanges();
        }

        public void DeleteRole(int id)
        {
            var roleInDb = _context.RoleTables.FirstOrDefault(s => s.Id == id && !s.Is_Deleted);
            if (roleInDb != null)
                _context.Remove(roleInDb);
            _context.SaveChanges();
        }

        public IEnumerable<RoleTable> GetAllRoles()
        {
            return _context.RoleTables.ToList();
        }

        public RoleTable GetRoleById(int id)
        {
            return _context.RoleTables.FirstOrDefault(r => r.Id == id);
        }

        public void UpdateRole(RoleTable role)
        {
            _context.RoleTables.Update(role);
            _context.SaveChanges();
        }
    }
}
