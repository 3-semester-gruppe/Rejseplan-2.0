using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RejseplanenLibrary;

namespace MoqDataGen
{
    class Program
    {
        private const string Uri = "https://rejseplanenapi20201207103315.azurewebsites.net/api/libraries/";

        static void Main(string[] args)
        {
            Random random = new Random(DateTime.Now.Millisecond);
            while (true)
            {
                Thread.Sleep(500);
                Post(new Library(random.Next(3,7),"henrik",DateTime.Now));
            }
        }

        static async void Post(Library value)
        {
            using (HttpClient client = new HttpClient())
            {
                string postBody = JsonConvert.SerializeObject(value);
                StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                Console.WriteLine((await client.PostAsync(Uri, stringContent)).StatusCode);
            }
        }
    }
}
