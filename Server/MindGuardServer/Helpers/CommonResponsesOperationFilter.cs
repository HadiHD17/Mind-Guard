using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class CommonResponsesOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        void Add(string code, string description)
        {
            if (!operation.Responses.ContainsKey(code))
                operation.Responses[code] = new OpenApiResponse { Description = description };
        }

        Add("400", "Bad Request");
        Add("401", "Unauthorized");
        Add("404", "Not Found");
    }
}
