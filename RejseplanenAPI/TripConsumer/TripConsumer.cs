using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RejseplanenLibrary;

namespace TripConsumer
{
    public class TripConsumer
    {
        private const string Uri = "http://localhost:49606/api/Trip";

        //Laver et kald til API'en, som henter alle trips
        public static async Task<IList<Trip>> GetAllAsync()
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync(Uri);
                IList<Trip> list = JsonConvert.DeserializeObject<IList<Trip>>(content);
                return list;
            }
        }

        //Laver et kald til API'en, som henter et trip med et specifikt ID
        public static async Task<Trip> GetByIdAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync($"{Uri}/{id}");
                Trip trip = JsonConvert.DeserializeObject<Trip>(content);
                return trip;
            }
        }

        //Laver et kald til API'en, som henter trips ud fra en specifik string
        public static async Task<IList<Trip>> GetBySubstringAsync(string substring)
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync($"{Uri}/UserName/{substring}");
                IList<Trip> list = JsonConvert.DeserializeObject<IList<Trip>>(content);
                return list;
            }
        }

        //Laver et kald til API'en, som tilføjer et trip
        public static async Task<bool> PostAsync(Trip value)
        {
            using (HttpClient client = new HttpClient())
            {
                string postBody = JsonConvert.SerializeObject(value);
                StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                return (await client.PostAsync(Uri, stringContent)).IsSuccessStatusCode;
            }
        }

        //Laver et kald til API'en, som sletter et specifikt trip
        public static async Task<bool> DeleteAsync(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                return (await client.DeleteAsync($"{Uri}/{id}")).IsSuccessStatusCode;
            }
        }
    }
}
