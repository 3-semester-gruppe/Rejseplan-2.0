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

        public static async Task<bool> PostAsync(Library value)
        {
            using (HttpClient client = new HttpClient())
            {
                string postBody = JsonConvert.SerializeObject(value);
                StringContent stringContent = new StringContent(postBody, Encoding.UTF8, "application/json");
                return (await client.PostAsync(Uri, stringContent)).IsSuccessStatusCode;
            }
        }
    }
}
