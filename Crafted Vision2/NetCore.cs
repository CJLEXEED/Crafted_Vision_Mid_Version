using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace ArtMarketplace.Controllers
{
    [ApiController]
    [Route("api")]
    public class ArtController : ControllerBase
    {
        private static List<Art> ArtList = new List<Art>();

        [HttpPost("addArt")]
        public IActionResult AddArt([FromBody] Art newArt)
        {
            ArtList.Add(newArt);
            return Ok(newArt);
        }

        [HttpGet("getArt")]
        public IActionResult GetArt()
        {
            return Ok(ArtList);
        }
    }

    public class Art
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
    }
}
