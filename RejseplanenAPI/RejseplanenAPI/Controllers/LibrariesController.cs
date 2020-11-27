using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RejseplanenAPI;
using RejseplanenLibrary;

namespace RejseplanenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibrariesController : ControllerBase
    {
        private readonly RejseplanenContext _context;

        public LibrariesController(RejseplanenContext context)
        {
            _context = context;
        }

        // GET: api/Libraries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Library>>> GetRejseplanen()
        {
            return await _context.Rejseplanen.ToListAsync();
        }

        // GET: api/Libraries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Library>> GetLibrary(int id)
        {
            var library = await _context.Rejseplanen.FindAsync(id);

            if (library == null)
            {
                return NotFound();
            }

            return library;
        }

        // GET: api/Libraries/Brugernavn/{substring}
        [HttpGet]
        [Route("Brugernavn/{substring}")]
        public async Task<ActionResult<IEnumerable<Library>>> GetBySubstring(string substring)
        {
            var library = await _context.Rejseplanen.ToListAsync();

            if (library.Count == 0)
            {
                return NotFound();
            }

            return library.FindAll(i => i.Brugernavn.ToLower() == substring.ToLower());
        }

        // POST: api/Libraries
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Library>> PostLibrary(Library library)
        {
            _context.Rejseplanen.Add(library);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLibrary", new { id = library.Id }, library);
        }

        // DELETE: api/Libraries/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Library>> DeleteLibrary(int id)
        {
            var library = await _context.Rejseplanen.FindAsync(id);
            if (library == null)
            {
                return NotFound();
            }

            _context.Rejseplanen.Remove(library);
            await _context.SaveChangesAsync();

            return library;
        }
        
        [HttpDelete("Brugernavn/{substring}")]
        public async Task DeleteLibrary(string substring)
        {
            while (true)
            {
                var library = _context.Rejseplanen.ToListAsync().Result.Find(lib => lib.Brugernavn.Equals(substring));
                if (library == null)
                {
                    return;
                }
                _context.Rejseplanen.Remove(library);
                await _context.SaveChangesAsync();
            }
        }

        private bool LibraryExists(int id)
        {
            return _context.Rejseplanen.Any(e => e.Id == id);
        }
    }
}
