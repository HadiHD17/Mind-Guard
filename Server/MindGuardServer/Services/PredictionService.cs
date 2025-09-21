using Microsoft.EntityFrameworkCore;
using MindGuardServer.Data;
using MindGuardServer.Models.Domain;
using MindGuardServer.Services.Interfaces;

namespace MindGuardServer.Services
{
    public class PredictionService : IPredictionService
    {
        private readonly AppDbContext _context;
        public PredictionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AI_Prediction> AddPrediction(AI_Prediction prediction)
        {
            await _context.AI_Predictions.AddAsync(prediction);
            await _context.SaveChangesAsync();
            return prediction;
        }

        public async Task<AI_Prediction> GetPrediction(int userid)
        {
            var prediction = await _context.AI_Predictions
                .Where(p => p.UserId == userid)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();
            if (prediction == null)
            {
                return null;
            }
            return prediction;
        }

    }
}
