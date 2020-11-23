using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RejseplanenLibrary;

namespace RejseplanenConsumer
{
    public class Consumer
    {
        private const string Uri = "http://localhost:49606/api/Libraries";

        public static void Start()
        {
            bool result = PostAsync(new Library(1, 10, "Test", new DateTime(2020, 11, 23))).Result;
            Console.WriteLine(result ? "POST succeded" : "POST failed!");

            result = PostAsync(new Library(2, 20, "Test2", new DateTime(2020, 11, 24))).Result;
            Console.WriteLine(result ? "POST succeded" : "POST failed!");

            result = PostAsync(new Library(3, 62, "Test3", new DateTime(2020, 11, 25))).Result;
            Console.WriteLine(result ? "POST succeded" : "POST failed!");

            Console.WriteLine(string.Join("\n", GetAllAsync().Result));

            Console.WriteLine("Enter ID to get:");
            var id = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(GetByIdAsync(id).Result);

            Console.WriteLine("Enter ID to delete:");
            id = Convert.ToInt32(Console.ReadLine());
            result = DeleteAsync(id).Result;
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");

            Console.WriteLine("All sensors:");
            Console.WriteLine(string.Join("\n", GetAllAsync().Result));

            Console.WriteLine("DONE");
        }

        public static async Task<IList<Library>> GetAllAsync()
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync(Uri);
                IList<Library> list = JsonConvert.DeserializeObject<IList<Library>>(content);
                return list;
            }
        }

        public static async Task<Library> GetByIdAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync($"{Uri}/{id}");
                Library library = JsonConvert.DeserializeObject<Library>(content);
                return library;
            }
        }

        public static async Task<bool> PostAsync(Library value)
        {
            using (HttpClient client = new HttpClient())
            {
                string postBody = JsonConvert.SerializeObject(value);
                StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                return (await client.PostAsync(Uri, stringContent)).IsSuccessStatusCode;
            }
        }

        public static async Task<bool> DeleteAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                return (await client.DeleteAsync($"{Uri}/{id}")).IsSuccessStatusCode;
            }
        }
    }
}
