namespace MindGuardServer.Helpers
{
    public class ApiResponse<T>
    {
        public string Status { get; set; }
        public T Payload { get; set; }
        public string? Message { get; set; } 

        public ApiResponse(string status, T payload, string? message = null)
        {
            Status = status;
            Payload = payload;
            Message = message;
        }

        public static ApiResponse<T> Success(T payload, string? message = null)
            => new ApiResponse<T>("success", payload, message);

        public static ApiResponse<T> Error(string? message = null)
            => new ApiResponse<T>("error", default!, message);
    }
}
