using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RejseplanenLibrary;

namespace RejseplanenAPI
{
    public class TripContext: DbContext
    {
        public TripContext(DbContextOptions<TripContext> options) : base(options) { }

        public DbSet<Trip> UserTrips { get; set; }
    }
}
