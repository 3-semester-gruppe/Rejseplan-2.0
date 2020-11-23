using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RejseplanenLibrary;

namespace RejseplanenAPI
{
    public class RejseplanenContext : DbContext
    {
        public RejseplanenContext(DbContextOptions<RejseplanenContext> options) : base(options) { }

        public DbSet<Library> Rejseplanen { get; set; }
    }
}
