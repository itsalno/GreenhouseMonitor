using System;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Interfaces.Infrastructure.MQTT;
using Application.Interfaces.Infrastructure.Postgres;
using Application.Interfaces.Infrastructure.Websocket;
using Application.Models;
using Application.Models.Dtos.BroadcastModels;
using Core.Domain.Entities;

namespace Application.Services
{
    public class SensorDataService(IMqttPublisher mqttPublisher,
        IConnectionManager connectionManager, ISensorDataRepository repository, IThresholdsService thresholdsService) : ISensorDataService
    {

        

        public async Task HandleMqttPayloadAsyncAndBroadcast(string payload)
        {
            try
            {
                var data = JsonSerializer.Deserialize<SensorDataPayload>(payload);
                if (data == null) return;

                var entity = new SensorData
                {
                    Timestamp = DateTimeOffset.UtcNow,
                    temperature = data.temperature,
                    humidity = data.humidity,
                    soil = data.soil,
                    window = data.window ?? string.Empty
                };

                await repository.InsertAsync(entity);
                var recentLogs =  repository.GetRecentLogs();
                var broadcast = new ServerBroadcastsLiveDataToDashboard
                {
                    Logs = recentLogs
                };
                await connectionManager.BroadcastToTopic(StringConstants.Dashboard, broadcast);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing MQTT message: {ex.Message}");
            }
        }

        public List<SensorData> GetRecentLogs(JwtClaims client)
        {
            return repository.GetRecentLogs();
        }
        
        public async Task DeleteDataAndBroadcast(JwtClaims jwt)
        {
            await repository.DeleteAllData();
            await connectionManager.BroadcastToTopic(StringConstants.Dashboard, new AdminHasDeletedData());
        }

        private class SensorDataPayload
        {
            public double temperature { get; set; }
            public double humidity { get; set; }
            public double soil { get; set; }
            public string? window { get; set; }
        }
    }
}