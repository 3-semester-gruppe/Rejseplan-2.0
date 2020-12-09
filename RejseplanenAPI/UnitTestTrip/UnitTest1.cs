using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RejseplanenLibrary;

namespace UnitTestTrip
{
    [TestClass]
    public class UnitTest1
    {
        private Trip _trip;

        [TestInitialize]
        public void BeforeTest()
        {
            _trip = new Trip("Test", "Roskilde St.", "Zealand (Maglegårdsvej)", DateTime.Now, new DateTime(2020, 12, 9, 18, 00, 00), 5, 1100, 11);
        }

        [TestMethod]
        public void IdValueTest()
        {
            Assert.AreEqual(5, _trip.Id);

            try
            {
                _trip.Id = 0;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Id må ikke være 0 eller negativt (Parameter 'Id')", ex.Message);
            }

            try
            {
                _trip.Id = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Id må ikke være 0 eller negativt (Parameter 'Id')", ex.Message);
            }
        }

        [TestMethod]
        public void UserNameInputTest()
        {
            _trip.UserName = "Te";
            Assert.AreEqual("Te", _trip.UserName);

            _trip.UserName = "Tes";
            Assert.AreEqual("Tes", _trip.UserName);

            try
            {
                _trip.UserName = "T";
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("UserName skal indeholde mindst to eller flere bogstaver (Parameter 'UserName')",
                    ex.Message);
            }

            try
            {
                _trip.UserName = " ";
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("UserName må ikke stå tomt eller have white space (Parameter 'UserName')",
                    ex.Message);
            }

            try
            {

                _trip.UserName = null;
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("UserName må ikke stå tomt eller have white space (Parameter 'UserName')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void EndDestinationInputTest()
        {
            _trip.EndDestination = "T";
            Assert.AreEqual("T", _trip.EndDestination);

            _trip.EndDestination = "Te";
            Assert.AreEqual("Te", _trip.EndDestination);

            try
            {
                _trip.EndDestination = " ";
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("EndDestination må ikke stå tomt eller have white space (Parameter 'EndDestination')",
                    ex.Message);
            }

            try
            {

                _trip.EndDestination = null;
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("EndDestination må ikke stå tomt eller have white space (Parameter 'EndDestination')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void AverageSpeedBoundaryValuesTest()
        {
            _trip.AverageSpeed = 0;
            Assert.AreEqual(0, _trip.AverageSpeed);

            _trip.AverageSpeed = 1;
            Assert.AreEqual(1, _trip.AverageSpeed);

            try
            {
                _trip.AverageSpeed = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("AverageSpeed må ikke være negativt (Parameter 'AverageSpeed')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void DistanceToWalkBoundaryValuesTest()
        {
            _trip.DistanceToWalk = 0;
            Assert.AreEqual(0, _trip.DistanceToWalk);

            _trip.DistanceToWalk = 1;
            Assert.AreEqual(1, _trip.DistanceToWalk);

            try
            {
                _trip.DistanceToWalk = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("DistanceToWalk må ikke være negativt (Parameter 'DistanceToWalk')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void TimeToWalkBoundaryValuesTest()
        {
            _trip.TimeToWalk = 0;
            Assert.AreEqual(0, _trip.TimeToWalk);

            _trip.TimeToWalk = 1;
            Assert.AreEqual(1, _trip.TimeToWalk);

            try
            {
                _trip.TimeToWalk = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("TimeToWalk må ikke være negativt (Parameter 'TimeToWalk')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void StartDestinationInputTest()
        {
            _trip.StartDestination = "Test";
            Assert.AreEqual("Test", _trip.StartDestination);
        }

        [TestMethod]
        public void DepartureTimeInputTest()
        {
            _trip.DepartureTime = new DateTime(2020, 11, 24);
            Assert.AreEqual(new DateTime(2020, 11, 24), _trip.DepartureTime);
        }

        [TestMethod]
        public void UserDepartureTimeInputTest()
        {
            _trip.UserDepartureTime = new DateTime(2020, 11, 24);
            Assert.AreEqual(new DateTime(2020, 11, 24), _trip.UserDepartureTime);
        }
    }
}
