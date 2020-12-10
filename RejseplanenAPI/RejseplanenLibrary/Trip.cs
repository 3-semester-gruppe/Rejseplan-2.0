using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RejseplanenLibrary
{
    public class Trip
    {
        private int _id;
        private string _userName;
        private string _endDestination;
        private double _averageSpeed;
        private int _distanceToWalk;
        private int _timeToWalk;

        [Key]
        public int Id
        {
            get => _id;
            set
            {
                if (value <= 0)
                {
                    throw new ArgumentOutOfRangeException("Id", "Id må ikke være 0 eller negativt");
                }

                _id = value;
            }
        }

        public string UserName
        {
            get => _userName;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException("UserName", "UserName må ikke stå tomt eller have white space");
                }

                if (value.Length < 2)
                {
                    throw new ArgumentOutOfRangeException("UserName", "UserName skal indeholde mindst to eller flere bogstaver");
                }

                _userName = value;
            }
        }

        public string StartDestination { get; set; }

        public string EndDestination
        {
            get => _endDestination;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException("EndDestination", "EndDestination må ikke stå tomt eller have white space");
                }

                _endDestination = value;
            }
        }

        public DateTime DepartureTime { get; set; }

        public DateTime UserDepartureTime { get; set; }

        public double AverageSpeed
        {
            get => _averageSpeed;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("AverageSpeed", "AverageSpeed må ikke være negativt");
                }

                _averageSpeed = value;
            }
        }

        public int DistanceToWalk
        {
            get => _distanceToWalk;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("DistanceToWalk", "DistanceToWalk må ikke være negativt");
                }

                _distanceToWalk = value;
            }
        }

        public int TimeToWalk
        {
            get => _timeToWalk;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("TimeToWalk", "TimeToWalk må ikke være negativt");
                }

                _timeToWalk = value;
            }
        }

        public static int IdCounter = 1;

        public Trip()
        {
            Id = IdCounter++;
        }

        public Trip(string userName, string startDestination, string endDestination, DateTime departureTime, DateTime userDepartureTime, double averageSpeed, int distanceToWalk, int timeToWalk)
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

        public override string ToString()
        {
            return $"Id: {Id}, UserName: {UserName}, StartDestination: {StartDestination}, EndDestination: {EndDestination}, DepartureTime: {DepartureTime}, UserDepartureTime: {UserDepartureTime}, AverageSpeed: {AverageSpeed}, DistanceToWalk: {DistanceToWalk}, TimeToWalk: {TimeToWalk}";
        }
    }
}
