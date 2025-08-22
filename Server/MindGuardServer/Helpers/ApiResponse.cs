namespace MindGuardServer.Helpers
{
    public class ApiResponse<T>
    {
        public string Status { get; set; } = "success";
        public T Payload { get; set; }

        public ApiResponse(T payload)
        {
            Payload = payload;
        }
    }
}
