using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RejseplanenLibrary;

namespace LibraryUnitTest
{
    [TestClass]
    public class UnitTest1
    {
        private Library _library;

        [TestInitialize]
        public void BeforeTest()
        {
            _library = new Library(
                50,
                "Test",
                new DateTime(2020, 11, 23)
            );
        }

        [TestMethod]
        public void IdValueTest()
        {
            Assert.AreEqual(1, _library.Id);

            try
            {
                _library.Id = 0;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Id må ikke være 0 eller negativt (Parameter 'Id')", ex.Message);
            }

            try
            {
                _library.Id = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Id må ikke være 0 eller negativt (Parameter 'Id')", ex.Message);
            }
        }

        [TestMethod]
        public void HastighedBoundaryValuesTest()
        {
            _library.Hastighed = 0;
            Assert.AreEqual(0, _library.Hastighed);

            _library.Hastighed = 1;
            Assert.AreEqual(1, _library.Hastighed);

            try
            {
                _library.Hastighed = -1;
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Hastighed må ikke være negativt (Parameter 'Hastighed')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void BrugernavnInputTest()
        {
            _library.Brugernavn = "Te";
            Assert.AreEqual("Te", _library.Brugernavn);

            _library.Brugernavn = "Tes";
            Assert.AreEqual("Tes", _library.Brugernavn);

            try
            {
                _library.Brugernavn = "T";
                Assert.Fail();
            }
            catch (ArgumentOutOfRangeException ex)
            {
                Assert.AreEqual("Brugernavn skal indeholde mindst to eller flere bogstaver (Parameter 'Brugernavn')",
                    ex.Message);
            }

            try
            {
                _library.Brugernavn = " ";
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("Brugernavn må ikke være tomt eller have white space (Parameter 'Brugernavn')",
                    ex.Message);
            }

            try
            {

                _library.Brugernavn = null;
                Assert.Fail();
            }
            catch (ArgumentNullException ex)
            {
                Assert.AreEqual("Brugernavn må ikke være tomt eller have white space (Parameter 'Brugernavn')",
                    ex.Message);
            }
        }

        [TestMethod]
        public void TimeStampInputTest()
        {
            _library.TimeStamp = new DateTime(2020, 11, 24);
            Assert.AreEqual(new DateTime(2020, 11, 24), _library.TimeStamp);
        }
    }
}
