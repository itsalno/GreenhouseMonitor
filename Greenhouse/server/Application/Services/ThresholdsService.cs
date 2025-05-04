using System.Threading.Tasks;
using Application.Interfaces.Infrastructure.Postgres;
using Core.Domain.Entities;

namespace Application.Services
{
    public class ThresholdsService : IThresholdsService
    {
        private readonly IThresholdsRepository _repo;
        public ThresholdsService(IThresholdsRepository repo) => _repo = repo;

        public Task<Thresholds?> GetThresholdsAsync() => _repo.GetAsync();

        public Task<Thresholds> UpdateThresholdsAsync(Thresholds updated)
            => _repo.UpdateAsync(updated);
    }
}
