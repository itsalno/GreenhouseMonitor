using Application.Interfaces;
using Application.Interfaces.Infrastructure.Websocket;
using Application.Models.Dtos.RestDtos;
using Core.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Rest.Controllers;

[ApiController]
public class SensorController(
    ISensorDataService sensorDataService ,
    IConnectionManager connectionManager,
    ISecurityService securityService) : ControllerBase
{
    public const string GetLogsRoute = nameof(GetSensorLogs);


    //public const string AdminChangesPreferencesRoute = nameof(AdminChangesPreferences);

    [HttpGet]
    [Route(GetLogsRoute)]
    public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorLogs([FromHeader] string authorization)
    {
        var claims = securityService.VerifyJwtOrThrow(authorization);
        var feed = sensorDataService.GetRecentLogs(claims);
        return Ok(feed);
    }

    /*[HttpPost]
    [Route(AdminChangesPreferencesRoute)]
    public async Task<ActionResult> AdminChangesPreferences([FromBody] AdminChangesPreferencesDto dto,
        [FromHeader] string authorization)
    {
        var claims = securityService.VerifyJwtOrThrow(authorization);
        await weatherStationService.UpdateDeviceFeed(dto, claims);
        return Ok();
    }*/

    public const string DeleteDataRoute = nameof(DeleteSensorData);
    [HttpDelete]
    [Route(DeleteDataRoute)]
    public async Task<ActionResult> DeleteSensorData([FromHeader]string authorization)
    {
        var jwt = securityService.VerifyJwtOrThrow(authorization);

        await sensorDataService.DeleteDataAndBroadcast(jwt);
        
        return Ok();
    }
    
}