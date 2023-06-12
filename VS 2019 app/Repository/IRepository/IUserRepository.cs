using Daily_Status_Report_task.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository.IRepository
{
    public interface IUserRepository
    {
        IEnumerable<UserTable> GetAllUsers();
        bool IsUniqueUser(string username, string name);
        UserTable Authenticate(string username, string password);
        UserTable Register(string username, string email, string name, string address, int departmentId, int roleId);
        UserTable UpdateUser(UserTable userTable);
        void DeleteUser(int id);
        Task<UserTable> GetUserById(int id);
        UserTable UpdateUsers(UserTable userTable);
        string GenerateRandomPassword();
        Task UpdatePasswordChangeStatus(int id, bool status);
        Task<bool> GetPasswordChangeStatus(string username);
        Task<UserTable> GetUserByUsernameAndEmail(string username, string email);

    }



}
