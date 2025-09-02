using AutoMapper;
using MindGuardServer.Models.Domain;
using MindGuardServer.Models.DTO;

namespace MindGuardServer.Mappings
{
    public class AutoMapperProfile :Profile
    {
        public AutoMapperProfile() 
        {

            //User 
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<User, UserResponseDto>();

            //Journal
            CreateMap<JournalEntryCreateDto, Journal_Entry>();
            CreateMap<JournalEntryUpdateDto, Journal_Entry>();
            CreateMap<Journal_Entry, JournalEntryResponseDto>();

            //Mood
            CreateMap<MoodCheckinCreateDto, Mood_Checkin>();
            CreateMap<Mood_Checkin, MoodCheckinResponseDto>();

            //Routine
            CreateMap<RoutineCreateDto, Routine>();
            CreateMap<RoutineUpdateDto, Routine>();
            CreateMap<Routine, RoutineResponseDto>()
                .ForMember(dest => dest.LastCompletedDate, opt => opt.MapFrom(src =>
                    src.Occurence
                       .Where(o => o.IsCompleted)
                       .OrderByDescending(o => o.Date)
                       .FirstOrDefault().Date
                ));


            //Occurence
            CreateMap<RoutineOccurrenceCreateDto, Routine_Occurence>();
            CreateMap<RoutineOccurrenceUpdateDto, Routine_Occurence>();
            CreateMap<Routine_Occurence, RoutineOccurrenceResponseDto>();

            //AI
            CreateMap<AIPredictionCreateDto, AI_Prediction>();
            CreateMap<AIPredictionUpdateDto, AI_Prediction>();
            CreateMap<AI_Prediction, AIPredictionResponseDto>();

            //Summary
            CreateMap<WeeklySummaryCreateDto, Weekly_Summary>();
            CreateMap<Weekly_Summary, WeeklySummaryResponseDto>();

        }
    }
}
