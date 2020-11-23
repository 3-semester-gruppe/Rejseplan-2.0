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

        //Methode som starter receiveren
        public static void Start()
        {
            //Laver en udpclient som modtager pakker fra alle IP addresser som peger på vores valgte port nr
            using (UdpClient udpClient = new UdpClient(new IPEndPoint(IPAddress.Any, Port)))
            {
                //Initialiserer et objekt af IPEndPoint til senere brug
                IPEndPoint receiveEndPoint = new IPEndPoint(0, 0);

                //try block som skal fange eventuelle exceptions
                try
                {
                    //Console writelin som fortæller at vi er klar til at modtage pakker
                    Console.WriteLine("Incoming measurements...");

                    //While loop som opfanger de pakker som bliver sent til vores receiver
                    while (true)
                    {
                        //receiveBytes er den første pakke som bliver modtaget og receiveEndpoint bliver defineret til hvor vi fik pakken fra
                        byte[] receiveBytes = udpClient.Receive(ref receiveEndPoint);

                        //Converter vores receiveBytes til en string receivedData
                        string receivedData = Encoding.ASCII.GetString(receiveBytes);

                        Console.WriteLine();

                        //Console writeline som viser IP addressen receiveBytes blev sent fra og hvilken port nr det blev sent på
                        Console.WriteLine($"Sent from {receiveEndPoint.Address} on port number {receiveEndPoint.Port}:");

                        //Console writeline som udskriver den string vi har converted vores receiveBytes til
                        Console.WriteLine(receivedData);

                        //Vi poster receivedData og returnerer true hvis det er lykkedes og false hvis det er mislykkedes som result bliver sat ud fra
                        bool result = Consumer.PostAsync(JsonConvert.DeserializeObject<Library>(receivedData)).Result;

                        //Console writeline som fortæller om vores result er true eller false alt eftter om vi fik posted eller ikke fik posted
                        Console.WriteLine(result ? "POST succeeded" : "POST failed!");
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