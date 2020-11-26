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
            IWebElement departureTime = driver.FindElement(By.Id("departureTime"));
            IWebElement walkSpeed = driver.FindElement(By.Id("walkSpeed"));
            IWebElement calculateButton = driver.FindElement(By.Id("go"));
            calculateButton.Click();
            Thread.Sleep(1000);
            double deltaTime = (DateTime.Parse(departureTime.Text) - DateTime.Now).TotalSeconds;

            Assert.AreEqual(Double.Parse(distance.Text)/deltaTime,Double.Parse(walkSpeed.Text),0.1);
        }

        [TestCleanup]
        public void TestTearDown()
        {
            driver.Quit();
        }
    }
}
