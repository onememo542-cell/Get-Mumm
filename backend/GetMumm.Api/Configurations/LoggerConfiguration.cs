using Serilog;

namespace GetMumm.Api.Configurations;

public static class LoggerConfiguration
{
    public static IHostBuilder ConfigureSerilog(this IHostBuilder hostBuilder)
    {
        hostBuilder.UseSerilog((context, config) =>
        {
            config
                .MinimumLevel.Information()
                .Enrich.FromLogContext()
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithThreadId()
                .WriteTo.Console()
                .WriteTo.File(
                    "logs/app-.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}");
        });

        return hostBuilder;
    }
}
