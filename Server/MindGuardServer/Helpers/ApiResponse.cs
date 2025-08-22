namespace MindGuardServer.Helpers
{
    public class ApiResponse<T>
    {
        public string Status { get; set; }
        public T Payload { get; set; }

        public ApiResponse(string status, T payload)
        {
            Status = status;
            Payload = payload;
        }

        public static ApiResponse<T> Success(T payload)
            => new ApiResponse<T>("success", payload);

        public static ApiResponse<T> Error()
            => new ApiResponse<T>("error", default!);
    }
}
