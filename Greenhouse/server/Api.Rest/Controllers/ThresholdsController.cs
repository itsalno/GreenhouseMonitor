using System.Threading.Tasks;
using Application.Services;
using Core.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Rest.Controllers;

[ApiController]
public class ThresholdsController : ControllerBase
{
    private readonly IThresholdsService _service;
    public ThresholdsController(IThresholdsService service) => _service = service;

    [HttpGet]
    [Route("api/sensor/thresholds")]
    public async Task<ActionResult<Thresholds>> Get()
    {
        var thresholds = await _service.GetThresholdsAsync();
        if (thresholds == null) return NotFound();
        return Ok(thresholds);
    }

    [HttpPost]
    [Route("api/sensor/thresholds")]
    public async Task<ActionResult<Thresholds>> Update([FromBody] Thresholds updated)
    {
        var result = await _service.UpdateThresholdsAsync(updated);
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/sensor/AllThresholds")]
    public async Task<ActionResult<Thresholds>> GetAll()
    {
        var thresholds = await _service.GetAllAsync();
        if (thresholds == null) return NotFound();
        return Ok(thresholds);
    }
}
