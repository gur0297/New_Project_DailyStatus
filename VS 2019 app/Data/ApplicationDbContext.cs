using Daily_Status_Report_task.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {

        }
        public DbSet<StatusTable> StatusTables { get; set; }
        public DbSet<UserTable> UserTables { get; set; }
        public DbSet<DepartmentTable> DepartmentTables { get; set; }
        public DbSet<RoleTable> RoleTables { get; set; }
        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Deleted))
            {
                entry.State = EntityState.Modified;
                entry.CurrentValues.SetValues(new { Is_Deleted = true });
            }
            return base.SaveChanges();
        }
    }
}
