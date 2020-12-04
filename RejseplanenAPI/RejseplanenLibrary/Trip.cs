using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RejseplanenLibrary
{
    public class Trip
    {
        [Key]
        public int Id { get; set; }
        public string UserName { get; set; }
        public string StartDestination { get; set; }
        public string EndDestination { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime UserDepartureTime { get; set; }
        public int AverageSpeed { get; set; }
        public int DistanceToWalk { get; set; }
        public int TimeToWalk { get; set; }

        public static int IdCounter = 1;

        public Trip()
        {
            Id = IdCounter++;
        }

        public Trip(string userName, string startDestination, string endDestination, DateTime departureTime, DateTime userDepartureTime, int averageSpeed, int distanceToWalk, int timeToWalk)
        {
            Id = IdCounter++;
            UserName = userName;
            StartDestination = startDestination;
            EndDestination = endDestination;
            DepartureTime = departureTime;
            UserDepartureTime = userDepartureTime;
            AverageSpeed = averageSpeed;
            DistanceToWalk = distanceToWalk;
            TimeToWalk = timeToWalk;
        }
    }
}
