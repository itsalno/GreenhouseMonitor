using System.Threading.Tasks;
using Application.Interfaces.Infrastructure.Postgres;
using Core.Domain.Entities;
using Infrastructure.Postgres.Scaffolding;
using System;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Postgres.Postgresql.Data
{
    public class SensorDataRepository : ISensorDataRepository
    {
        private readonly MyDbContext ctx;

        public SensorDataRepository(MyDbContext ctx)
        {
            this.ctx = ctx;
        }

        public async Task InsertAsync(SensorData data)
        {
            await ctx.SensorData.AddAsync(data);
            await ctx.SaveChangesAsync();
        }
        public List<SensorData> GetRecentLogs()
        {
            return ctx.SensorData.ToList();
        }
        public async Task DeleteAllData()
        {
            var allDataLogs = ctx.SensorData.ToList();
            ctx.RemoveRange(allDataLogs);
            await ctx.SaveChangesAsync();
        }
    }
}