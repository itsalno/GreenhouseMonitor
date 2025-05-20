using Core.Domain.Entities;

namespace Application.Interfaces.Infrastructure.Postgres;

public interface IThresholdsRepository
{
    Task<Thresholds?> GetAsync();
    Task<Thresholds> UpdateAsync(Thresholds updated);

    Task<List<Thresholds>> GetAllAsync();
}