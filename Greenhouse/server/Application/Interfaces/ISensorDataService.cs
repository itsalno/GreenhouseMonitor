using System.Threading.Tasks;
using Application.Models;
using Application.Models.Dtos.RestDtos;
using Core.Domain.Entities;

namespace Application.Interfaces
{
    public interface ISensorDataService
    {
        public List<SensorData> GetRecentLogs(JwtClaims client);
        Task HandleMqttPayloadAsyncAndBroadcast(string payload);
        Task DeleteDataAndBroadcast(JwtClaims jwt);
    }
}
