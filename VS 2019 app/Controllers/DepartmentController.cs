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
    [Route("api/department")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;

        public DepartmentController(IDepartmentRepository departmentRepository, IMapper mapper)
        {
            _departmentRepository = departmentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<DepartmentTable> GetDepartments()
        {
            return _departmentRepository.GetAllDepartments();
        }

        [HttpGet("{departmentId}")]
        public ActionResult<IEnumerable<DepartmentTable>> GetDepartmentByDepartmentId(int id)
        {
            var departmentInDb = _departmentRepository.GetDepartmentById(id);
            return Ok(departmentInDb);
        }

        [HttpPost("newDepartment")]
        public IActionResult SaveDepartment([FromBody] DepartmentTableDto departmentTableDto )
        {
            if (departmentTableDto == null)
                return BadRequest(ModelState);
            var newDepartment = _mapper.Map<DepartmentTableDto, DepartmentTable>(departmentTableDto);
            _departmentRepository.CreateDepartment(newDepartment);
            return Ok(newDepartment);
        }

        [HttpPut("updateDepartment")]
        public IActionResult UpdateDepartment([FromBody] DepartmentTableDto departmentTableDto)
        {
            if (departmentTableDto == null) return BadRequest(ModelState);
            var updateDepartment = _mapper.Map<DepartmentTableDto, DepartmentTable>(departmentTableDto);
            _departmentRepository.UpdateDepartment(updateDepartment);
            return Ok(updateDepartment);
        }

        [HttpDelete("{id:int}")]
        public void DeleteDepartment(int id)
        {
            _departmentRepository.DeleteDepartment(id);
        }
    }
}
