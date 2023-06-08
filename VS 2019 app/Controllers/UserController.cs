using AutoMapper;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Models.DTO;
using Daily_Status_Report_task.Repository.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailSenderRepository _emailSenderRepository;

        public UserController(IUserRepository userRepository, IEmailSenderRepository emailSenderRepository, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _emailSenderRepository = emailSenderRepository;
        }

        [HttpGet]
        public IEnumerable<UserTable> GetUsers()
        {
            return _userRepository.GetAllUsers();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var userById = await _userRepository.GetUserById(id);
            if (userById == null)
            {
                return NotFound();
            }
            var userId = _mapper.Map<UserTable, UserTablesDto>(userById);
            return Ok(userId);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] UserTable user)
        {
            if (ModelState.IsValid)
            {
                var isUniqueUser = _userRepository.IsUniqueUser(user.Email, user.Name);
                if (!isUniqueUser) return BadRequest("User In Use");

                var userInfo = _userRepository.Register(user.Email, user.Name, user.Address, user.Department_Id, user.Role_Id);
                if (userInfo == null)
                    return BadRequest();

                if (user.Email != null)
                {
                    string password = userInfo.Password; // Get the password generated in the userRepository

                    // Send email with the random password
                    string emailBody = "<html><body style=\"font-family: Arial, sans-serif; background-image: url('/Images/scenery-image.jpg'); background-repeat: no-repeat; background-size: cover; padding: 20px;\">"
                        + "<div style=\"background-color: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #336699;\">"
                        + $"<h2 style=\"color: #336699; margin-bottom: 20px;\">Dear {user.Name},</h2>"
                        + "<p style=\"color: #444; font-size: 16px;\">Welcome to our platform! We are excited to have you as a new user.</p>"
                        + "<p style=\"color: #444; font-size: 16px;\">Here is your randomly generated password: <strong>" + password + "</strong></p>"
                        + "<p style=\"color: #444; font-size: 16px;\">If you have any questions or need assistance, please feel free to contact us.</p>"
                        + "<p style=\"color: #444; font-size: 16px;\">Thank you and enjoy your experience with us!</p>"
                        + "<p style=\"color: #777; font-size: 14px;\">Best regards,</p>"
                        + "<p style=\"color: #777; font-size: 14px;\">3G Family Developers</p>"
                        + "<p style=\"color: #FF0000; font-size: 14px;\">You've successfully registered with us</p>"
                        + "</div>"
                        + "</body></html>";

                    await _emailSenderRepository.SendEmailAsync(user.Email, "Welcome to Our 3G Dev Hub", emailBody);
                }
            }
            return Ok();
        }

        [HttpGet("getPasswordChangeStatus/{email}")]
        public async Task<IActionResult> GetPasswordChangeStatus(string email)
        {
            var passwordChangeStatus = await _userRepository.GetPasswordChangeStatus(email);
            return Ok(passwordChangeStatus);
        }


        [HttpPost("authenticateViaRandomPassword")]
        public IActionResult Authenticate(UserVM userVM)
        {
            var user = _userRepository.Authenticate(userVM.Email, userVM.Password);

            if (user == null)
                return BadRequest("Wrong Username & Password please enter valid Username & Password");

            if (user.PasswordChangeStatus)
                return BadRequest("Password has been changed. Please use encrypted password for authentication.");

            return Ok(user);
        }

        [HttpPost("authenticateViaEncryptPassword")]
        public IActionResult AuthenticateEncrypt(UserVM userVM)
        {
            var user = _userRepository.Authenticate(userVM.Email, Encryption(userVM.Password));

            if (user == null)
                return BadRequest("Wrong Username & Password please enter valid Username & Password");

            if (!user.PasswordChangeStatus)
                return BadRequest("Password has not been changed. Please use the original password for authentication.");

            return Ok(user);
        }

        /*  [HttpPost("authenticateViaRandomPassword")]
          public IActionResult Authenticate(UserVM userVM)
          {
              var user = _userRepository.Authenticate(userVM.Email, userVM.Password);
              if (user == null) return BadRequest("Wrong Username & Password please enter valid Usename & Password");  //400
              return Ok(user); //200
          }

          [HttpPost("authenticateViaEncryptPassword")]
          public IActionResult AuthenticateEncrypt(UserVM userVM)
          {
              var user = _userRepository.Authenticate(userVM.Email, Encryption(userVM.Password));
              if (user == null) return BadRequest("Wrong Username & Password please enter valid Usename & Password");  //400
              return Ok(user); //200
          }*/

        /*[HttpPut("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserTableDto userTableDto)
        {
            if (userTableDto == null) return BadRequest(ModelState);

            // Get existing user from DB
            var existingUser = _userRepository.GetUserById(userTableDto.Id).Result;

            if (existingUser == null)
                return NotFound("User Not Found");

            var User = _mapper.Map<UserTableDto, UserTable>(userTableDto);

            // Check if password has been updated
            if (User.Password != existingUser.Password)
            {
                // Send email to confirm password update
                string emailBody = "<html><body style=\"font-family: Arial, sans-serif; background-image: url('/Images/scenery-image.jpg'); background-repeat: no-repeat; background-size: cover; padding: 20px;\">"
                    + "<div style=\"background-color: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #336699;\">"
                    + $"<h2 style=\"color: #336699; margin-bottom: 20px;\">Dear {existingUser.Name},</h2>"
                    + "<p style=\"color: #444; font-size: 16px;\">Your password has been successfully updated on our platform.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">If you have any questions or need assistance, please feel free to contact us.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">Thank you and enjoy your experience with us!</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">Best regards,</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">3G Family Developers</p>"
                    + "<p style=\"color: #FF0000; font-size: 14px;\">You've successfully update your password</p>"
                    + "</div>"
                    + "</body></html>";

                // Send email to confirm password update
                await _emailSenderRepository.SendEmailAsync(existingUser.Email, " Your Password Has Been Updated at 3G Dev Hub", emailBody);
            }

            _userRepository.UpdateUser(User);
            return Ok(User);
        }        */

        [HttpPut("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserTableDto userTableDto)
        {
            if (userTableDto == null) return BadRequest(ModelState);

            // Get existing user from DB
            var existingUser = await _userRepository.GetUserById(userTableDto.Id);

            if (existingUser == null)
                return NotFound("User Not Found");

            var User = _mapper.Map<UserTableDto, UserTable>(userTableDto);

            // Check if password has been updated
            if (User.Password != existingUser.Password)
            {
                User.PasswordChangeStatus = true;

                // Send email to confirm password update
                string emailBody = "<html><body style=\"font-family: Arial, sans-serif; background-image: url('/Images/scenery-image.jpg'); background-repeat: no-repeat; background-size: cover; padding: 20px;\">"
                    + "<div style=\"background-color: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #336699;\">"
                    + $"<h2 style=\"color: #336699; margin-bottom: 20px;\">Dear {existingUser.Name},</h2>"
                    + "<p style=\"color: #444; font-size: 16px;\">Your password has been successfully updated on our platform.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">If you have any questions or need assistance, please feel free to contact us.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">Thank you and enjoy your experience with us!</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">Best regards,</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">3G Family Developers</p>"
                    + "<p style=\"color: #FF0000; font-size: 14px;\">You've successfully update your password</p>"
                    + "</div>"
                    + "</body></html>";
                // Send email to confirm password update
                await _emailSenderRepository.SendEmailAsync(existingUser.Email, " Your Password Has Been Updated at 3G Dev Hub", emailBody);
            }

            // If PasswordChangeStatus is true, update it in the repository.
            if (User.PasswordChangeStatus)
                await _userRepository.UpdatePasswordChangeStatus(User.Id, true);

            _userRepository.UpdateUser(User);
            return Ok(User);
        }


        [HttpPut("updateUserDetail")]
        public async Task<IActionResult> UpdateUserDetail([FromBody] UserTablesDto userTablesDto)
        {
            if (userTablesDto == null) return BadRequest(ModelState);

            // Get existing user from DB
            var existingUser = _userRepository.GetUserById(userTablesDto.Id).Result;

            if (existingUser == null)
                return NotFound("User Not Found");

            var User = _mapper.Map<UserTablesDto, UserTable>(userTablesDto);

            // Check if email has been updated
            if (User.Email != existingUser.Email)
            {
                // Send email to new email address
                string emailBody = "<html><body style=\"font-family: Arial, sans-serif; background-image: url('/Images/scenery-image.jpg'); background-repeat: no-repeat; background-size: cover; padding: 20px;\">"
                    + "<div style=\"background-color: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #336699;\">"
                    + $"<h2 style=\"color: #336699; margin-bottom: 20px;\">Dear {User.Name},</h2>"
                    + "<p style=\"color: #444; font-size: 16px;\">Your email has been successfully updated on our platform.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">If you have any questions or need assistance, please feel free to contact us.</p>"
                    + "<p style=\"color: #444; font-size: 16px;\">Thank you and enjoy your experience with us!</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">Best regards,</p>"
                    + "<p style=\"color: #777; font-size: 14px;\">3G Family Developers</p>"
                    + "<p style=\"color: #336699; font-size: 14px;\">You've successfully update your email</p>"
                    + "</div>"
                    + "</body></html>";

                await _emailSenderRepository.SendEmailAsync(User.Email, " Your Email Has Been Updated at 3G Dev Hub", emailBody);
            }

            _userRepository.UpdateUsers(User);
            return Ok(User);
        }


        [HttpDelete("{id:int}")]
        public void DeleteUser(int id)
        {
            _userRepository.DeleteUser(id);
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
