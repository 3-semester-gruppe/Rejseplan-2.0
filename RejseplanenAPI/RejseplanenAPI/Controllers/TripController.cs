using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RejseplanenLibrary;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RejseplanenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly TripContext _context;

        public TripController(TripContext context)
        {
            _context = context;
        }

        // GET: api/Trip
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.UserTrips.ToListAsync();
        }

        // GET: api/Trip/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.UserTrips.FindAsync(id);

            if (trip == null)
            {
                return NotFound();
            }

            return trip;
        }

        // GET: api/Trip/UserName/{substring}
        [HttpGet]
        [Route("UserName/{substring}")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetBySubstring(string substring)
        {
            var trip = await _context.UserTrips.ToListAsync();

            if (trip.Count == 0)
            {
                return NotFound();
            }

            return trip.FindAll(e => e.UserName.ToLower() == substring.ToLower());
        }

        // POST: api/Trip
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Trip>> PostTrip(Trip trip)
        {
            _context.UserTrips.Add(trip);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrip", new { id = trip.Id }, trip);
        }

        // DELETE: api/Trip/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Trip>> DeleteTripById(int id)
        {
            var trip = await _context.UserTrips.FindAsync(id);
            if (trip == null)
            {
                return NotFound();
            }

            _context.UserTrips.Remove(trip);
            await _context.SaveChangesAsync();

            return trip;
        }

        // DELETE: api/Trip/UserName/{substring}
        [HttpDelete("UserName/{substring}")]
        public async Task DeleteTripByUserName(string substring)
        {
            while (true)
            {
                var trip = _context.UserTrips.ToListAsync().Result.Find(trip => trip.UserName.ToLower().Equals(substring.ToLower()));
                if (trip == null)
                {
                    return;
                }
                _context.UserTrips.Remove(trip);
                await _context.SaveChangesAsync();
            }
        }

        private bool TripExists(int id)
        {
            return _context.UserTrips.Any(e => e.Id == id);
        }
    }
}
