namespace Core.Domain.Entities;

public class Thresholds
{
    public int Id { get; set; }
    public float TempLow { get; set; }
    public float TempHigh { get; set; }
    public float HumidityLow { get; set; }
    public float HumidityHigh { get; set; }
}