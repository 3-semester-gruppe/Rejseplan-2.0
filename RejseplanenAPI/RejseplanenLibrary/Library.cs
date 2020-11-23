using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RejseplanenLibrary
{
    public class Library
    {
        [Key]
        public int Id { get; set; }
        public double Hastighed { get; set; }
        public string Brugernavn { get; set; }
        public DateTime TimeStamp { get; set; }

        public Library()
        {
            
        }

        public Library(int id, double hastighed, string brugernavn, DateTime timeStamp)
        {
            Id = id;
            Hastighed = hastighed;
            Brugernavn = brugernavn;
            TimeStamp = timeStamp;
        }
    }
}
