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

        [HttpGet]
        public IEnumerable<StatusTable> GetStatus()
        {
            return _statusRepository.GetAllReports();
        }

        [HttpGet("{statusId}")]
        public ActionResult<IEnumerable<StatusTable>> GetStatusByStatusId(int id)
        {
            var statusInDb = _statusRepository.GetReportById(id);
            return Ok(statusInDb);
        }

        [HttpPost("addStatus")]
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
        }

        [HttpDelete("{id:int}")]
        public void DeleteStatus(int id)
        {
            _statusRepository.DeleteReport(id);
        }
    }
}
