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
            bool result = Consumer.PostAsync(new Library(10, "Test", new DateTime(2020, 11, 23))).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = Consumer.PostAsync(new Library(20, "Test2", new DateTime(2020, 11, 24))).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            result = Consumer.PostAsync(new Library(62, "Test3", new DateTime(2020, 11, 25))).Result;
            Console.WriteLine(result ? "POST succeeded" : "POST failed!");

            Console.WriteLine(string.Join("\n", Consumer.GetAllAsync().Result));

            Console.WriteLine("Enter ID to get:");
            var id = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(Consumer.GetByIdAsync(id).Result);

            Console.WriteLine("Enter ID to delete:");
            id = Convert.ToInt32(Console.ReadLine());
            result = Consumer.DeleteAsync(id).Result;
            Console.WriteLine(result ? "DELETE succeeded" : "DELETE failed!");

            Console.WriteLine("All sensors:");
            Console.WriteLine(string.Join("\n", Consumer.GetAllAsync().Result));

            Console.WriteLine("DONE");
        }
    }
}
