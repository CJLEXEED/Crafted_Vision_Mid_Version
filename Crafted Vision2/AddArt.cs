using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

[HttpPost("addArt")]
public IActionResult AddArt([FromBody] Art newArt)
{
    string connectionString = "YourConnectionStringHere";
    using (SqlConnection conn = new SqlConnection(connectionString))
    {
        conn.Open();
        string query = "INSERT INTO Artworks (Title, Description, Price, Image) VALUES (@Title, @Description, @Price, @Image)";
        SqlCommand cmd = new SqlCommand(query, conn);
        cmd.Parameters.AddWithValue("@Title", newArt.Title);
        cmd.Parameters.AddWithValue("@Description", newArt.Description);
        cmd.Parameters.AddWithValue("@Price", newArt.Price);
        cmd.Parameters.AddWithValue("@Image", newArt.Image);
        cmd.ExecuteNonQuery();
    }
    return Ok(newArt);
}
