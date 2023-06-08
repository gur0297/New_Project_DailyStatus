using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.Repository.IRepository
{
    public interface IEmailSenderRepository
    {
        Task Execute(string email, string Subject, string message);
        Task SendEmailAsync(string email, string subject, string message);
    }
}