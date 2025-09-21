using MindGuardServer.Models.Domain;

namespace MindGuardServer.Services.Interfaces
{
    public interface IPredictionService
    {
        Task<AI_Prediction> AddPrediction(AI_Prediction prediction);
        Task<AI_Prediction> GetPrediction(int userid);
    }
}
