namespace Application.Models.Dtos.BroadcastModels
{
    public class AdminHasDeletedData : ApplicationBaseDto
    {
        public override string eventType { get; set; } = nameof(AdminHasDeletedData);
    }
}
