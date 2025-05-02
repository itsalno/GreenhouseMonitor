using Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Postgres.Scaffolding;

public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Devicelog> Devicelogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<SensorData> SensorData { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Devicelog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("devicelog_pkey");

            entity.ToTable("devicelog", "weatherstation");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deviceid).HasColumnName("deviceid");
            entity.Property(e => e.Timestamp).HasColumnName("timestamp");
            entity.Property(e => e.Unit).HasColumnName("unit");
            entity.Property(e => e.Value).HasColumnName("value");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_pkey");

            entity.ToTable("user");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Hash).HasColumnName("hash");
            entity.Property(e => e.Role).HasColumnName("role");
            entity.Property(e => e.Salt).HasColumnName("salt");
        });

        modelBuilder.Entity<SensorData>(entity =>
        {
            entity.ToTable("sensor_data");
            entity.HasKey(e => e.Id); 
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Timestamp).HasColumnName("timestamp");
            entity.Property(e => e.temperature).HasColumnName("temperature");
            entity.Property(e => e.humidity).HasColumnName("humidity");
            entity.Property(e => e.soil).HasColumnName("soil");
            entity.Property(e => e.window).HasColumnName("window_status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}