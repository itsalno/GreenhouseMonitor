using System.Threading.Tasks;
using Core.Domain.Entities;

namespace Application.Interfaces.Infrastructure.Postgres
{
    public interface ISensorDataRepository
    {
        Task InsertAsync(SensorData data);
        List<SensorData> GetRecentLogs();
        Task DeleteAllData();
    }
}
