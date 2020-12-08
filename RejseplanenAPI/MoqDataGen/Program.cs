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
        public static double speed = 5;
        private const string Uri = "https://rejseplanenapi20201207103315.azurewebsites.net/api/libraries/";

        static void Main(string[] args)
        {
            Random random = new Random(DateTime.Now.Millisecond);
            Post();
            bool upOrDown = true;
            while (true)
            {
                if (upOrDown)
                {
                    speed += Convert.ToDouble(random.Next(-10, 15) / 100); 
                }
                else
                {
                    speed -= Convert.ToDouble(random.Next(-10, 15) / 100);
                }

                if (speed > 10)
                {
                    upOrDown = false;
                }

                if (speed < 1)
                {
                    upOrDown = true;
                }

                if (random.Next(0, 100) > 98)
                {
                    upOrDown = !upOrDown;
                }
                Console.WriteLine(speed);
            }
        }

        static async void Post()
        {
            using (HttpClient client = new HttpClient())
            {
                while (true)
                {
                    Library value = new Library(speed, "henrik", DateTime.Now);
                    string postBody = JsonConvert.SerializeObject(value);
                    StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                    Console.WriteLine((await client.PostAsync(Uri, stringContent)).StatusCode);
                    Thread.Sleep(500);
                }
            }
        }
    }
}
