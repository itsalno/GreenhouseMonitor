using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Interfaces.Infrastructure.MQTT;
using Application.Interfaces.Infrastructure.Postgres;
using Application.Interfaces.Infrastructure.Websocket;
using Application.Models;
using Application.Models.Dtos.BroadcastModels;
using Core.Domain.Entities;

namespace Application.Services
{
    public class ThresholdsService : IThresholdsService
    {
        private readonly IThresholdsRepository _repo;
        private readonly IMqttPublisher _mqttPublisher;
        private readonly IConnectionManager _connectionManager;

        public ThresholdsService(IThresholdsRepository repo, IMqttPublisher mqttPublisher, IConnectionManager connectionManager)
        {
            _repo = repo;
            _mqttPublisher = mqttPublisher;
            _connectionManager = connectionManager;
        }

        public Task<Thresholds?> GetThresholdsAsync() => _repo.GetAsync();

        public async Task<Thresholds> UpdateThresholdsAsync(Thresholds updated)
        {
            var currentThresholds = await _repo.GetAsync();

            var result = await _repo.UpdateAsync(updated);

            if (currentThresholds != null)
            {
                if (currentThresholds.TempHigh != result.TempHigh)
                {
                    await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto
                    {
                        ThresholdType = "TemperatureHigh",
                        OldValue = currentThresholds.TempHigh,
                        NewValue = result.TempHigh,
                        Unit = "°C",
                        Timestamp = DateTime.UtcNow
                    });
                }
                if (currentThresholds.TempLow != result.TempLow)
                {
                    await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto
                    {
                        ThresholdType = "TemperatureLow",
                        OldValue = currentThresholds.TempLow,
                        NewValue = result.TempLow,
                        Unit = "°C",
                        Timestamp = DateTime.UtcNow
                    });
                }
                if (currentThresholds.HumidityHigh != result.HumidityHigh)
                {
                    await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto
                    {
                        ThresholdType = "HumidityHigh",
                        OldValue = currentThresholds.HumidityHigh,
                        NewValue = result.HumidityHigh,
                        Unit = "%",
                        Timestamp = DateTime.UtcNow
                    });
                }
                if (currentThresholds.HumidityLow != result.HumidityLow)
                {
                    await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto
                    {
                        ThresholdType = "HumidityLow",
                        OldValue = currentThresholds.HumidityLow,
                        NewValue = result.HumidityLow,
                        Unit = "%",
                        Timestamp = DateTime.UtcNow
                    });
                }
            }
            else
            {
                await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto { ThresholdType = "TemperatureHigh", OldValue = 0, NewValue = result.TempHigh, Unit = "°C", Timestamp = DateTime.UtcNow });
                await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto { ThresholdType = "TemperatureLow", OldValue = 0, NewValue = result.TempLow, Unit = "°C", Timestamp = DateTime.UtcNow });
                await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto { ThresholdType = "HumidityHigh", OldValue = 0, NewValue = result.HumidityHigh, Unit = "%", Timestamp = DateTime.UtcNow });
                await _connectionManager.BroadcastToTopic(StringConstants.ThresholdsHistory, new ThresholdUpdateBroadcastDto { ThresholdType = "HumidityLow", OldValue = 0, NewValue = result.HumidityLow, Unit = "%", Timestamp = DateTime.UtcNow });
            }

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
