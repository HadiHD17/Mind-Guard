namespace MindGuardServer.Helpers
{
    public class MoodMapper
    {
        public static int? MapMood(string? moodLabel, string? detectedEmotion)
        {
            if (!string.IsNullOrEmpty(moodLabel))
            {
                return moodLabel.ToLower() switch
                {
                    "very sad" or "depressed" => 1,
                    "sad" or "down" => 2,
                    "neutral" => 3,
                    "happy" => 4,
                    "very happy" or "excited" => 5,
                    _ => 3
                };
            }

            if (!string.IsNullOrEmpty(detectedEmotion))
            {
                return detectedEmotion.ToLower() switch
                {
                    "anger" => 1,
                    "sadness" => 2,
                    "neutral" => 3,
                    "joy" => 4,
                    "excitement" => 5,
                    _ => 3
                };
            }

            return null;
        }
    }
}

