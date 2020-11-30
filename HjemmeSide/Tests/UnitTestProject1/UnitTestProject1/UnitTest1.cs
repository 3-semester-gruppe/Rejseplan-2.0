using System;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace CalculatorSeleniumTest
{
    [TestClass]
    public class UnitTest1
    {
        const string URL = "http://localhost:3000/";
        IWebDriver driver = new ChromeDriver();

        [TestInitialize]
        public void TestSetUp()
        {
            driver.Navigate().GoToUrl(URL);
        }

        [TestMethod]
        public void TestBeregnHvorHurtigtBrugerSkalGaa()
        {
            IWebElement distance = driver.FindElement(By.Id("distance"));
            IWebElement distanceInput = driver.FindElement(By.Id("distanceInput"));
            distanceInput.Clear();
            IWebElement departure = driver.FindElement(By.Id("departure"));
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();
            IWebElement walkSpeed = driver.FindElement(By.Id("hastighed"));
            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));

            distanceInput.SendKeys("5000");

            departureTime.SendKeys(DateTime.Now.AddHours(5).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(5).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(5).Minute.ToString());
            calculateButton.Click();

            Assert.AreEqual(5,Double.Parse(walkSpeed.Text.Replace(".",",")),0.3);

            distanceInput.Clear();
            departureTime.Clear();

            distanceInput.SendKeys("5000");

            departureTime.SendKeys(DateTime.Now.AddHours(1).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(1).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(1).Minute.ToString());
            calculateButton.Click();

            Assert.AreEqual(5, Double.Parse(walkSpeed.Text.Replace(".", ",")), 0.3);

            distanceInput.Clear();
            departureTime.Clear();

            distanceInput.SendKeys("5000");

            departureTime.SendKeys(DateTime.Now.AddHours(0.5).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(0.5).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(0.5).Minute.ToString());
            calculateButton.Click();
            Assert.AreEqual(10, Double.Parse(walkSpeed.Text.Replace(".", ",")), 0.3);
        }

        [TestMethod]
        public void TestAfgangstidspunkt()
        {
            IWebElement distance = driver.FindElement(By.Id("distance"));
            IWebElement distanceInput = driver.FindElement(By.Id("distanceInput"));
            distanceInput.Clear();

            IWebElement departure = driver.FindElement(By.Id("departure"));
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();

            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));

            IWebElement userDepartureTime = driver.FindElement(By.Id("userDepartureTime"));

            distanceInput.SendKeys("3000");
            departureTime.SendKeys(DateTime.Now.AddHours(3).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(3).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(3).Minute.ToString());

            calculateButton.Click();

            Assert.AreEqual(DateTime.Parse(departure.Text).AddMinutes(-36), DateTime.Parse(userDepartureTime.Text));

            departureTime.SendKeys(DateTime.Now.AddMinutes(-36).Minute.ToString());
        }

        [TestCleanup]
        public void TestTearDown()
        {
            driver.Quit();
        }
    }
}
