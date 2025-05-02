using Core.Domain.Entities;

namespace Application.Interfaces.Infrastructure.Postgres;

public interface IWeatherStationRepository
{
    List<Devicelog> GetRecentLogs();
    Devicelog AddDeviceLog(Devicelog devicelog);
    Task DeleteAllData();
}