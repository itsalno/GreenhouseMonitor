using System;

namespace Core.Domain.Entities
{
    public class SensorData
    {
        public int Id { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public double temperature { get; set; }
        public double humidity { get; set; }
        public double soil { get; set; }
        public string window { get; set; } = string.Empty;
    }
}
