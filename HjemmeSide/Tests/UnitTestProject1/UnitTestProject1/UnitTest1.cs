using System;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace RejseplanenSeleniumTest
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
            IWebElement afgangssted = driver.FindElement(By.Id("afgangsstedInput"));
            afgangssted.Clear();
            IWebElement ankomststed = driver.FindElement(By.Id("ankomststedInput"));
            ankomststed.Clear();
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();
            IWebElement walkSpeed = driver.FindElement(By.Id("hastighed"));
            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));

            departureTime.Click();
            departureTime.SendKeys(DateTime.Now.AddHours(5).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(5).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(5).Minute.ToString());
            afgangssted.Click();
            Thread.Sleep(1000);
            afgangssted.SendKeys("Zealand (Maglegårdsvej)");
            Thread.Sleep(1000);
            ankomststed.Click();
            Thread.Sleep(1000);
            ankomststed.SendKeys("Roskilde St.");
            Thread.Sleep(1000);

            calculateButton.Click();

            Assert.AreEqual(5, Double.Parse(walkSpeed.Text.Replace(" km/t", "").Replace(".", ",")), 0.3);

            departureTime.Clear();

            departureTime.Click();
            departureTime.SendKeys(DateTime.Now.AddMinutes(14).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddMinutes(14).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddMinutes(14).Minute.ToString());
            calculateButton.Click();

            Assert.AreEqual(5, Double.Parse(walkSpeed.Text.Replace(" km/t", "").Replace(".", ",")), 0.3);

            departureTime.Clear();

            departureTime.Click();
            departureTime.SendKeys(DateTime.Now.AddMinutes(7.1).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddMinutes(7.1).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddMinutes(7.1).Minute.ToString());
            calculateButton.Click();
            Assert.AreEqual(10, Double.Parse(walkSpeed.Text.Replace(" km/t", "").Replace(".", ",")), 0.9);
        }

        [TestMethod]
        public void TestAfgangstidspunkt()
        {
            IWebElement afgangssted = driver.FindElement(By.Id("afgangsstedInput"));
            afgangssted.Clear();
            IWebElement ankomststed = driver.FindElement(By.Id("ankomststedInput"));
            ankomststed.Clear();
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();

            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));
            IWebElement userDepartureTime = driver.FindElement(By.Id("userDepartureTime"));

            afgangssted.Click();
            afgangssted.SendKeys("Zealand (Maglegårdsvej)");
            Thread.Sleep(1000);
            ankomststed.Click();
            ankomststed.SendKeys("Roskilde St.");
            Thread.Sleep(1000);

            departureTime.Click();
            departureTime.SendKeys(DateTime.Now.AddHours(3).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(3).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(3).Minute.ToString());

            calculateButton.Click();
            Thread.Sleep(2000);

            Assert.AreEqual(DateTime.Parse(departureTime.Text).AddMinutes(-36), DateTime.Parse(userDepartureTime.Text));
        }

        [TestMethod]
        public void TestMaxHastighed()
        {
            IWebElement afgangsstedInput = driver.FindElement(By.Id("afgangsstedInput"));
            afgangsstedInput.Clear();

            IWebElement ankomststedInput = driver.FindElement(By.Id("ankomststedInput"));
            ankomststedInput.Clear();

            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();

            IWebElement maksHastighed = driver.FindElement(By.Id("maksHastighed"));
            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));

            afgangsstedInput.Click();
            afgangsstedInput.SendKeys("Roskilde St.");
            Thread.Sleep(2000);
            ankomststedInput.Click();
            ankomststedInput.SendKeys("Aalborg St.");
            Thread.Sleep(2000);

            departureTime.Click();
            departureTime.SendKeys(DateTime.Now.AddHours(3).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(3).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(3).Minute.ToString());

            calculateButton.Click();
            Thread.Sleep(2000);

            Console.WriteLine(maksHastighed.Text);
            Assert.AreEqual("Vi estimerer, at du ikke vil nå dit ankomststed i tide. Vælg venligst et senere tidspunkt.", maksHastighed.Text);
        }

        [TestCleanup]
        public void TestTearDown()
        {
            driver.Quit();
        }
    }
}
