using Daily_Status_Report_task.Data;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Repository.IRepository;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly AppSettings _appSettings;
        public UserRepository(ApplicationDbContext context, IOptions<AppSettings> appsettings)
        {
            _context = context;
            _appSettings = appsettings.Value;
        }
        public async Task<bool> GetPasswordChangeStatus(string email)
        {
            var user = await _context.UserTables.FindAsync(email);

            return user != null ? user.PasswordChangeStatus : false;
        }


        public async Task UpdatePasswordChangeStatus(int id, bool status)
        {
            var user = await _context.UserTables.FindAsync(id);

            if (user != null)
            {
                user.PasswordChangeStatus = status;
                await _context.SaveChangesAsync();
            }
        }

        public UserTable Authenticate(string email, string password)
        {
            var userInDb = _context.UserTables.FirstOrDefault(User => User.Email == email && User.Password == password);
            if (userInDb == null)
                return null;
            //JWT Authentication  //Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userInDb.Id.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            userInDb.Token = tokenHandler.WriteToken(token);

            userInDb.Password = "";
            return userInDb;
        }

        public void DeleteUser(int id)
        {
            var userInDb = _context.UserTables.FirstOrDefault(s => s.Id == id && !s.Is_Deleted);
            if (userInDb != null)
                _context.UserTables.Remove(userInDb);
            _context.SaveChanges();
        }

        public IEnumerable<UserTable> GetAllUsers()
        {
            return _context.UserTables.Where(s => !s.Is_Deleted).ToList();
        }

        public async Task<UserTable> GetUserById(int id)
        {
            return await _context.UserTables.FindAsync(id);
        }

        public bool IsUniqueUser(string email, string name)
        {
            var user = _context.UserTables.FirstOrDefault(u => u.Email == email && u.Name == name);
            if (user == null)
                return true;
            else
                return false;
        }

        /* public UserTable Register(string email, string password, string name, string address, int departmentId, int roleId)
         {
             UserTable userTable = new UserTable()
             {
                 Name = name,
                 Address = address,
                 Email_Register_Date = DateTime.Now,                
                 Email = email,
                 Password = Encryption(password),
                 Department_Id = departmentId,
                 Role_Id = roleId,
             };
             _context.UserTables.Add(userTable);
             _context.SaveChanges();
             return userTable;
         }*/

        public UserTable Register(string email, string name, string address, int departmentId, int roleId)
        {
            string password = GenerateRandomPassword(); // Generate random password
            UserTable userTable = new UserTable()
            {
                Name = name,
                Address = address,
                Email_Register_Date = DateTime.Now,
                Email = email,
                Password = password,
                Department_Id = departmentId,
                Role_Id = roleId,
            };
            _context.UserTables.Add(userTable);
            _context.SaveChanges();
            return userTable;
        }


        public string GenerateRandomPassword()
        {
            // Generate a random password using a combination of letters, numbers, and special characters
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            Random random = new Random();
            string password = new string(Enumerable.Repeat(chars, 8) // Change 8 to the desired password length
                .Select(s => s[random.Next(s.Length)]).ToArray());
            return password;
        }



        public UserTable UpdateUser(UserTable userTable)
        {
            var updateUser = _context.UserTables.FirstOrDefault(e => e.Id == userTable.Id);
            if (updateUser != null)
            {
                updateUser.Password = Encryption(userTable.Password);
                _context.SaveChanges();
            }
            return updateUser;
        }

        public UserTable UpdateUsers(UserTable userTable)
        {
            var updateUser = _context.UserTables.FirstOrDefault(e => e.Id == userTable.Id);
            if (updateUser != null)
            {
                updateUser.Name = userTable.Name;
                updateUser.Address = userTable.Address;
                updateUser.Email = userTable.Email;
                updateUser.Password = userTable.Password;
                updateUser.Email_Register_Date = userTable.Email_Register_Date;
                updateUser.Department_Id = userTable.Department_Id;
                updateUser.Role_Id = userTable.Role_Id;

                _context.SaveChanges();
            }
            return updateUser;
        }

        public static string Encryption(string password)
        {
            if (string.IsNullOrEmpty(password))
                return null;
            else
            {
                byte[] storepassword = Encoding.ASCII.GetBytes(password);
                string encryption = Convert.ToBase64String(storepassword);
                return encryption;
            }
        }
    }
}
