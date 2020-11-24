using System;
using System.Collections.Generic;
using System.Text;
using RejseplanenLibrary;

namespace RejseplanenConsumer
{
    class IntegrationTest
    {
        public static void Start()
        {
            //Tilføjer en ny sensor med dummy data til API'en
            bool result = Consumer.PostAsync(new Library(10, "Test", new DateTime(2020, 11, 23))).Result;
            //Udskriver om sensoren blev tilføjet succesfuldt eller ej
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = Consumer.PostAsync(new Library(20, "Test2", new DateTime(2020, 11, 24))).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = Consumer.PostAsync(new Library(62, "Test3", new DateTime(2020, 11, 25))).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            //Henter alle sensor readings
            Console.WriteLine(string.Join("\n", Consumer.GetAllAsync().Result));

            //Beder brugeren om at indtaste et specifikt ID, som skal hentes
            Console.WriteLine("Enter ID to get:");
            var id = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(Consumer.GetByIdAsync(id).Result);

            //Beder brugeren om at indtaste et specifikt ID, som skal slettes
            Console.WriteLine("Enter ID to delete:");
            id = Convert.ToInt32(Console.ReadLine());
            result = Consumer.DeleteAsync(id).Result;
            //Udskriver om sensoren blev slettet succesfuldt eller ej
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");

            //Henter alle sensor readings, efter brugeren har foretaget de foregående kommandoer
            Console.WriteLine("All sensors:");
            Console.WriteLine(string.Join("\n", Consumer.GetAllAsync().Result));

            //Sletter alle de tilføjede sensor readings
            result = Consumer.DeleteAsync(1).Result;
            bool result2 = Consumer.DeleteAsync(2).Result;
            bool result3 = Consumer.DeleteAsync(3).Result;
            //Udskriver om sensoren blev slettet succesfuldt eller ej
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");
            Console.WriteLine(result2 ? "DELETE succeeded" : "DELETE failed!");
            Console.WriteLine(result3 ? "DELETE succeeded" : "DELETE failed!");

            //Indikerer, at testen er slut
            Console.WriteLine("DONE");
        }
    }
}
