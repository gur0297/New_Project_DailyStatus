using AutoMapper;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Models.DTO;
using Daily_Status_Report_task.Repository.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskStatus = Daily_Status_Report_task.Models.TaskStatus;

namespace Daily_Status_Report_task.Controllers
{
    [Route("api/status")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusRepository _statusRepository;
        private readonly IMapper _mapper;

        public StatusController(IStatusRepository statusRepository, IMapper mapper)
        {
            _statusRepository = statusRepository;
            _mapper = mapper;
        }

        /* [HttpGet]
         public IEnumerable<StatusTable> GetStatus()
         {
             return _statusRepository.GetAllReports();
         }

         [HttpGet("{statusId}")]
         public ActionResult<IEnumerable<StatusTable>> GetStatusByStatusId(int id)
         {
             var statusInDb = _statusRepository.GetReportById(id);
             return Ok(statusInDb);
         }*/

        [HttpGet]
        public IEnumerable<StatusTableDto> GetStatus([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 3)
        {
            var statusReports = _statusRepository.GetAllReports(pageNumber, pageSize);
            var statusReportDtos = statusReports.Select(x => new StatusTableDto
            {
                Id = x.Id,
                TaskName = x.TaskName,
                Date = x.Date,
                Hours = x.Hours,
                Minutes = x.Minutes,
                Success = x.Success,
                Obstacle = x.Obstacle,
                NextDayPlan = x.NextDayPlan,
                User_Id = x.User_Id,
                Status = x.Status.ToString()
            });
            return statusReportDtos;
        }

        [HttpGet("{statusId}")]
        public ActionResult<StatusTableDto> GetStatusByStatusId(int id)
        {
            var statusInDb = _statusRepository.GetReportById(id);
            var statusDto = new StatusTableDto
            {
                Id = statusInDb.Id,
                TaskName = statusInDb.TaskName,
                Date = statusInDb.Date,
                Hours = statusInDb.Hours,
                Minutes = statusInDb.Minutes,
                Success = statusInDb.Success,
                Obstacle = statusInDb.Obstacle,
                NextDayPlan = statusInDb.NextDayPlan,
                User_Id = statusInDb.User_Id,
                Status = statusInDb.Status.ToString()
            };
            return Ok(statusDto);
        }

        /* [HttpPost("addStatus")]
         public IActionResult SaveStatus([FromBody] StatusTableDto statusTableDto)
         {
             if (statusTableDto == null)
                 return BadRequest(ModelState);
             var newStatus = _mapper.Map<StatusTableDto, StatusTable>(statusTableDto);
             _statusRepository.CreateReport(newStatus);
             return Ok(newStatus);
         }

         [HttpPut("updateStatus")]
         public IActionResult UpdateStatus([FromBody] StatusTableDto statusTableDto)
         {
             if (statusTableDto == null) return BadRequest(ModelState);
             var updateStatus = _mapper.Map<StatusTableDto, StatusTable>(statusTableDto);
             _statusRepository.UpdateReport(updateStatus);
             return Ok(updateStatus);
         }*/

        [HttpPost("addStatus")]
        public IActionResult SaveStatus([FromBody] StatusTableDto statusTableDto)
        {
            if (statusTableDto == null)
                return BadRequest(ModelState);
            var newStatus = _mapper.Map<StatusTableDto, StatusTable>(statusTableDto);
            newStatus.Status = Enum.TryParse(typeof(TaskStatus), statusTableDto.Status, out var status) ? (TaskStatus)status : TaskStatus.Pending;
            _statusRepository.CreateReport(newStatus);
            return Ok(newStatus);
        }

        [HttpPut("updateStatus")]
        public IActionResult UpdateStatus([FromBody] StatusTableDto statusTableDto)
        {
            if (statusTableDto == null) return BadRequest(ModelState);
            var updateStatus = _mapper.Map<StatusTableDto, StatusTable>(statusTableDto);
            updateStatus.Status = Enum.TryParse(typeof(TaskStatus), statusTableDto.Status, out var status) ? (TaskStatus)status : TaskStatus.Pending;
            _statusRepository.UpdateReport(updateStatus);
            return Ok(updateStatus);
        }


        [HttpDelete("{id:int}")]
        public void DeleteStatus(int id)
        {
            _statusRepository.DeleteReport(id);
        }
    }
}
