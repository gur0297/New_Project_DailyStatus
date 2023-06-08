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
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;

        public RoleController(IRoleRepository roleRepository,IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<RoleTable> GetRoles()
        {
            return _roleRepository.GetAllRoles();
        }

        [HttpGet("{roleId}")]
        public ActionResult<IEnumerable<RoleTable>> GetRoleByRoleId(int id)
        {
            var roleInDb = _roleRepository.GetRoleById(id);
            return Ok(roleInDb);
        }

        [HttpPost("newRole")]
        public IActionResult SaveRole([FromBody] RoleTableDto roleTableDto)
        {
            if (roleTableDto == null)
                return BadRequest(ModelState);
            var newRole = _mapper.Map<RoleTableDto, RoleTable>(roleTableDto);
            _roleRepository.CreateRole(newRole);
            return Ok(newRole);
        }

        [HttpPut("updateRole")]
        public IActionResult UpdateRole([FromBody] RoleTableDto roleTableDto)
        {
            if (roleTableDto == null) return BadRequest(ModelState);
            var updateRole = _mapper.Map<RoleTableDto, RoleTable>(roleTableDto);
            _roleRepository.UpdateRole(updateRole);
            return Ok(updateRole);
        }

        [HttpDelete("{id:int}")]
        public void DeleteRole(int id)
        {
            _roleRepository.DeleteRole(id);
        }
    }
}
