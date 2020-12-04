using System;
using System.Collections.Generic;
using System.Text;
using RejseplanenLibrary;

namespace TripConsumer
{
    class TripIntegrationTest
    {
        public static void Start()
        {
            //Tilføjer et nyt trip med dummy data til API'en
            bool result = TripConsumer.PostAsync(new Trip("Test", "Roskilde St.", "Aalborg St.", new DateTime(2020, 12, 4, 12, 22, 00), new DateTime(2020, 12, 4, 10, 10, 00), 50, 100, 14)).Result;
            //Udskriver om trippet blev tilføjet succesfuldt eller ej
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = TripConsumer.PostAsync(new Trip("Test", "Roskilde St.", "Aalborg St.", new DateTime(2020, 12, 4, 12, 22, 00), new DateTime(2020, 12, 4, 10, 10, 00), 50, 100, 14)).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = TripConsumer.PostAsync(new Trip("Test", "Roskilde St.", "Aalborg St.", new DateTime(2020, 12, 4, 12, 22, 00), new DateTime(2020, 12, 4, 10, 10, 00), 50, 100, 14)).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            //Henter alle trips
            Console.WriteLine(string.Join("\n", TripConsumer.GetAllAsync().Result));

            //Beder brugeren om at indtaste et specifikt ID, som skal hentes
            Console.WriteLine("Enter ID to get:");
            var id = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(TripConsumer.GetByIdAsync(id).Result);

            //Beder brugeren om at indtaste et specifikt brugernavn, som alle trips hentes for
            Console.WriteLine("Enter substring to get:");
            var substring = Console.ReadLine();
            Console.WriteLine(string.Join("\n", TripConsumer.GetBySubstringAsync(substring).Result));

            //Beder brugeren om at indtaste et specifikt ID, som skal slettes
            Console.WriteLine("Enter ID to delete:");
            id = Convert.ToInt32(Console.ReadLine());
            result = TripConsumer.DeleteAsync(id).Result;
            //Udskriver om trippet blev slettet succesfuldt eller ej
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");

            //Henter alle trips, efter brugeren har foretaget de foregående kommandoer
            Console.WriteLine("All sensors:");
            Console.WriteLine(string.Join("\n", TripConsumer.GetAllAsync().Result));

            //Sletter alle de tilføjede trips
            result = TripConsumer.DeleteAsync(1).Result;
            bool result2 = TripConsumer.DeleteAsync(2).Result;
            bool result3 = TripConsumer.DeleteAsync(3).Result;
            //Udskriver om trippet blev slettet succesfuldt eller ej
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");
            Console.WriteLine(result2 ? "DELETE succeeded" : "DELETE failed!");
            Console.WriteLine(result3 ? "DELETE succeeded" : "DELETE failed!");

            //Indikerer, at testen er slut
            Console.WriteLine("DONE");
        }
    }
}
