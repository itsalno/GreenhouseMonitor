using System.Threading.Tasks;
using Application.Interfaces.Infrastructure.MQTT;
using Application.Interfaces.Infrastructure.Postgres;
using Core.Domain.Entities;

namespace Application.Services
{
    public class ThresholdsService : IThresholdsService
    {
        private readonly IThresholdsRepository _repo;
        private readonly IMqttPublisher _mqttPublisher;
        public ThresholdsService(IThresholdsRepository repo, IMqttPublisher mqttPublisher)
        {
            _repo = repo;
            _mqttPublisher = mqttPublisher;
        }


        public Task<Thresholds?> GetThresholdsAsync() => _repo.GetAsync();

        public async Task<Thresholds> UpdateThresholdsAsync(Thresholds updated)
        {
            var result = await _repo.UpdateAsync(updated);

            // Publish updated thresholds
            await _mqttPublisher.Publish(result, "esp32/receive");

            return result;
        }

        public async Task<List<Thresholds>> GetAllAsync()
        {
           var result = await _repo.GetAllAsync();
           return result;

        }
    }
}
