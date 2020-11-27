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
        public void TestMethod1()
        {
            IWebElement distance = driver.FindElement(By.Id("distance"));
            IWebElement distanceInput = driver.FindElement(By.Id("distanceInput"));
            distanceInput.Clear();
            IWebElement departure = driver.FindElement(By.Id("departure"));
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            departureTime.Clear();
            IWebElement walkSpeed = driver.FindElement(By.Id("hastighed"));
            IWebElement calculateButton = driver.FindElement(By.Id("hastighedBtn"));

            distanceInput.SendKeys("3000");

            departureTime.SendKeys(DateTime.Now.AddHours(3).ToString("dd/MM/yyyy"));
            departureTime.SendKeys(Keys.Tab);
            departureTime.SendKeys(DateTime.Now.AddHours(3).Hour.ToString());
            departureTime.SendKeys(DateTime.Now.AddHours(3).Minute.ToString());
            calculateButton.Click();


            double deltaTime = ((DateTime.Parse(departure.Text) - DateTime.Now).TotalSeconds)/3600;

            Assert.AreEqual((Double.Parse(distance.Text)/1000)/deltaTime,Double.Parse(walkSpeed.Text.Replace(".",",")),0.1);
        }

        [TestCleanup]
        public void TestTearDown()
        {
            driver.Quit();
        }
    }
}
