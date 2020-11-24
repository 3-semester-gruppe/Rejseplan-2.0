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

        //Laver et kald til API'en, som henter alle sensor readings
        public static async Task<IList<Library>> GetAllAsync()
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync(Uri);
                IList<Library> list = JsonConvert.DeserializeObject<IList<Library>>(content);
                return list;
            }
        }

        //Laver et kald til API'en, som henter en sensor reading med et specifikt ID
        public static async Task<Library> GetByIdAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync($"{Uri}/{id}");
                Library library = JsonConvert.DeserializeObject<Library>(content);
                return library;
            }
        }

        //Laver et kald til API'en, som tilføjer en sensor reading
        public static async Task<bool> PostAsync(Library value)
        {
            using (HttpClient client = new HttpClient())
            {
                string postBody = JsonConvert.SerializeObject(value);
                StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                return (await client.PostAsync(Uri, stringContent)).IsSuccessStatusCode;
            }
        }

        //Laver et kald til API'en, som sletter en specifik sensor reading
        public static async Task<bool> DeleteAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                return (await client.DeleteAsync($"{Uri}/{id}")).IsSuccessStatusCode;
            }
        }
    }
}
