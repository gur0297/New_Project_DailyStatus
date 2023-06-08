using Daily_Status_Report_task.Repository.IRepository;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository
{
    public class EmailSenderRepository : IEmailSenderRepository
    {
        private EmailSetting _emailSetting { get; }
        public EmailSenderRepository(IOptions<EmailSetting> emailsetting)
        {
            _emailSetting = emailsetting.Value;
        }

        public async Task Execute(string email, string Subject, string message)
        {
            try
            {
                //  string ToEmail = string.IsNullOrEmpty(email) ? _emailSetting.ToEmail : email;
                string ToEmail = email;
                MailMessage Mail = new MailMessage()
                {
                    From = new MailAddress(_emailSetting.UsernameEmail, "Daily Status Report")
                };
                Mail.To.Add(ToEmail);
                Mail.CC.Add(_emailSetting.CcEmail);
                Mail.Subject = "Status Report" + Subject;
                Mail.Body = message;
                Mail.IsBodyHtml = true;
                Mail.Priority = MailPriority.High;
                using (SmtpClient smtp = new SmtpClient(_emailSetting.PrimaryDomain, _emailSetting.PrimaryPort))
                {
                    smtp.Credentials = new NetworkCredential(_emailSetting.UsernameEmail, _emailSetting.UsernamePassword);
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(Mail);
                }
            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            Execute(email, subject, htmlMessage).Wait();
            return Task.FromResult(0);
        }
    }
}
