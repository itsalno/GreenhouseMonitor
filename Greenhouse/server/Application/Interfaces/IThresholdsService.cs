using System.Threading.Tasks;
using Core.Domain.Entities;

namespace Application.Services
{
    public interface IThresholdsService
    {
        Task<Thresholds?> GetThresholdsAsync();
        Task<Thresholds> UpdateThresholdsAsync(Thresholds updated);
    }
}
