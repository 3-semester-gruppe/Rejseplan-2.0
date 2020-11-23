using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RejseplanenLibrary
{
    public class Library
    {
        private int _id;
        private double _hastighed;
        private string _brugernavn;

        public static int Counter = 1;

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

        public double Hastighed
        {
            get => _hastighed;
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("Hastighed", "Hastighed må ikke være negativt");
                }

                _hastighed = value;
            }
        }

        public string Brugernavn
        {
            get => _brugernavn;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException("Brugernavn", "Brugernavn må ikke være tomt eller have white space");
                }

                if (value.Length < 2)
                {
                    throw new ArgumentOutOfRangeException("Brugernavn", "Brugernavn skal indeholde mindst to eller flere bogstaver");
                }

                _brugernavn = value;
            }
        }

        public DateTime TimeStamp { get; set; }

        public Library()
        {
            Id = Counter++;
        }

        public Library(double hastighed, string brugernavn, DateTime timeStamp)
        {
            Id = Counter++;
            Hastighed = hastighed;
            Brugernavn = brugernavn;
            TimeStamp = timeStamp;
        }

        public override string ToString()
        {
            return $"Id: {Id}, Hastighed: {Hastighed}, Brugernavn: {Brugernavn}, TimeStamp: {TimeStamp}";
        }
    }
}
