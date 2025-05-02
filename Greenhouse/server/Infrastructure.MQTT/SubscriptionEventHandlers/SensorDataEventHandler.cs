using System.Threading.Tasks;
using Application.Interfaces;
using HiveMQtt.Client.Events;
using HiveMQtt.MQTT5.Types;

namespace Infrastructure.MQTT.SubscriptionEventHandlers
{
    public class SensorDataEventHandler : IMqttMessageHandler
    {
        private readonly IServiceScopeFactory _scopeFactory;
        public string TopicFilter => "greenhouse/sensors/data";
        public QualityOfService QoS => QualityOfService.AtLeastOnceDelivery;

        public SensorDataEventHandler(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async void Handle(object? sender, OnMessageReceivedEventArgs args)
        {
            using var scope = _scopeFactory.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<ISensorDataService>();
            await service.HandleMqttPayloadAsyncAndBroadcast(args.PublishMessage.PayloadAsString);
        }
    }
}