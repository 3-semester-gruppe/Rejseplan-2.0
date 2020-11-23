using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using Newtonsoft.Json;
using RejseplanenConsumer;
using RejseplanenLibrary;

namespace UdpReceiver
{
    class Receiver
    {
        //Port nr der lyttes på
        private const int Port = 7000;

        //Methode 
        public static void Start()
        {
            using (UdpClient udpClient = new UdpClient(new IPEndPoint(IPAddress.Any, Port)))
            {
                IPEndPoint receiveEndPoint = new IPEndPoint(0, 0);

                try
                {
                    Console.WriteLine("Incoming measurements...");

                    while (true)
                    {
                        byte[] receiveBytes = udpClient.Receive(ref receiveEndPoint);

                        string receivedData = Encoding.ASCII.GetString(receiveBytes);

                        Console.WriteLine();
                        Console.WriteLine($"Sent from {receiveEndPoint.Address} on port number {receiveEndPoint.Port}:");

                        Console.WriteLine(receivedData);
                        Console.WriteLine(Consumer.PostAsync(JsonConvert.DeserializeObject<Library>(receivedData)).Result ? "POST succeeded" : "POST failed!");

                        Thread.Sleep(500);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }
    }
}