using System.Threading.Tasks;
using Application.Interfaces.Infrastructure.Postgres;
using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Postgres.Scaffolding
{
    public class ThresholdsRepository : IThresholdsRepository
    {
        private readonly MyDbContext _context;
        public ThresholdsRepository(MyDbContext context) => _context = context;

        public async Task<Thresholds?> GetAsync()
            => await _context.Thresholds.FirstOrDefaultAsync();

        public async Task<Thresholds> UpdateAsync(Thresholds updated)
        {
            var entity = await _context.Thresholds.FirstOrDefaultAsync();
            if (entity == null) throw new System.Exception("Thresholds not found");

            entity.TempLow = updated.TempLow;
            entity.TempHigh = updated.TempHigh;
            entity.HumidityLow = updated.HumidityLow;
            entity.HumidityHigh = updated.HumidityHigh;

            await _context.SaveChangesAsync();
            return entity;
        }
        
        public async Task<List<Thresholds>> GetAllAsync()
        {
            return await _context.Thresholds.ToListAsync();
        }
        
        
    }
}
