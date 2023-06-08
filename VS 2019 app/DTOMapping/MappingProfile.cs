using AutoMapper;
using Daily_Status_Report_task.Models;
using Daily_Status_Report_task.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Daily_Status_Report_task.DTOMapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<StatusTable,StatusTableDto >().ReverseMap();
            CreateMap<UserTable, UserTableDto>().ReverseMap();
            CreateMap<UserTablesDto, UserTable>().ReverseMap();
        }
    }
}
