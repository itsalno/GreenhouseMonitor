using System;

namespace Application.Models.Dtos.BroadcastModels
{
    public class ThresholdUpdateBroadcastDto : ApplicationBaseDto
    {
        public override string eventType { get; set; } = nameof(ThresholdUpdateBroadcastDto);
        public string ThresholdType { get; set; } 
        public string? SensorId { get; set; } 
        public double OldValue { get; set; }
        public double NewValue { get; set; }
        public string Unit { get; set; } 
        public DateTime Timestamp { get; set; }
        public string? ChangedByUserId { get; set; } 
    }
}
