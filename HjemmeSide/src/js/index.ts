//Koordinat support
import coord from "proj4";

//https request support
import Axios from "../../node_modules/axios/index";
import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

//url til hastigheds målinger
let baseUrl:string = 'https://rejseplanenapi20201207103315.azurewebsites.net/api/libraries/';
//url til gemte rejser
let baseUrlTrip:string = 'https://rejseplanenapi20201207103315.azurewebsites.net/api/Trip/';

//url support til vejr api
let openWeatherBaseUrl:string = "https://api.openweathermap.org/data/2.5/weather?";
let openWeatherLat:string = "lat=";
let openWeatherLong:string = "&lon=";
let openWeatherApiKey:string = "&appid=412be2f2e33e80c87ba34e35ac054489";

//tiden som din rute er delayed med
let delayedTime:number = 5;

//class til brug af rejseplanens api
class Location{
    name: string;
    coord: Array<number>
    distance: number;

    constructor(Name: string, Coord: Array<number>, Distance: number){
      this.name = Name;
      this.coord = Coord
      this.distance = Distance;
    }
}

//class til formatering af json og data håndtering i forbindelse af rejser
interface ITrip {
  "id": number,
  "userName": string,
  "startDestination": string,
  "endDestination": string,
  "departureTime": Date,
  "userDepartureTime": Date,
  "averageSpeed": number,
  "distanceToWalk": number,
  "timeToWalk": number
}

//class til formatering af json og data håndtering i forbindelse af hastigheds målinger
interface ILibrary {
    "brugernavn": string,
    "hastighed": number,
    "timestamp": Date,
    "id": number
}

//class til formatering og data håndtering i forbindelse af stoppesteder fra rejseplanen
interface IStoppested {
  name: string,
  x: string,
}

//Vue support til dropdown når der søges efter stationer
Vue.component('v-select', VueSelect.VueSelect)
//vue object
var main = new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    //Alt dataen der bruges i sammenhæng med vue
    data: {
      //hvor der skal være afgang fra
        afgang: "",
      //hvor der skal ankommes til
        ankomst: "",

      //den hastighed der skal gås for at man når til stationen
        hastighed: null,
      //hvornår man skal være på den givne station
        departureTime: null,
      //distancen man skal gå mellem de to stopsteder
        distance: null,
      //tidspunktet brugeren trykkede udregn
        userDepartureTime: null,
        userDepartureTimeDisplay: null,
      
      //længdegrad for hvor man er
      longitude: null,
      //breddegrad for hvor man er
        latitude: null,

      //stoppestedder man kan tage afsted fra som en del af søgning
        afgang_stoppested: [],
      //stoppestedder man kan komme hen til som en del af søgning
        ankomst_stoppested: [],
      //hvilken afgang stoppested man har valgt
        selected_afgang: null,
      //hvilken ankomst stoppested man har valgt
        selected_ankomst: null,

      //temperaturen for ens lokation eller afgangs stoppestedet man har valgt
        temperature: null,
      //chill faktoren for ens lokation eller afgangs stoppestedet man har valgt
        feels_like: null,
      //vind hastigheden for ens lokation eller afgangs stoppestedet man har valgt
        wind_speed: null,
      //hvilken vinkel vinden kommer fra for ens lokation eller afgangs stoppestedet man har valgt
        wind_degree: null,
      //fugtigheden for ens lokation eller afgangs stoppestedet man har valgt
        humidity: null,
      //trykket for ens lokation eller afgangs stoppestedet man har valgt
        pressure: null,
      //vejr typen for ens lokation eller afgangs stoppestedet man har valgt
        weather_type: "",
      //hvilken by ens lokation eller afgangs stoppestedet man har valgt er i
        current_city: "",
      //hvad klokken og hvilken dag det er på en lokation eller afgangs stoppested man har valgt
        current_dateTime: "",
      

      //temperaturen for ankomst stoppestedet man har valgt
        dest_temperature: 0,
      //chill faktoren for ankomst stoppestedet man har valgt
        dest_feels_like: 0,
      //vind hastigheden for ankomst stoppestedet man har valgt
        dest_wind_speed: 0,
      //hvilken vinkel vinden kommer fra for ankomst stoppestedet man har valgt
        dest_wind_degree: 0,
      //fugtigheden for ankomst stoppestedet man har valgt
        dest_humidity: 0,
      //trykket for ankomst stoppestedet man har valgt
        dest_pressure: 0,
      //vejr typen for ankomst stoppestedet man har valgt
        dest_weather_type: "Choose a station first",
      //hvilken by ankomst stoppestedet man har valgt er i
        dest_current_city: "City",
      //hvad klokken og hvilken dag det er ankomst stoppested man har valgt
        dest_current_dateTime: "Date",

      //styling til hvis den beregnede hastighed vil være for stor, og man ikke kan nå det
        styleObject: {
          background: '#800000',
          color: 'white',
          fontSize: '14px',
        },
      //styling til ift hvor hurtigt man går, og man skal gå hurtigere eller langsomere etc
        styleObject2: {
          background: '#336eff',
          color: 'white',
          fontSize: '14px',
        },
      
      //hvor langt tid man har til at gå den givne hastighed
        timeRemaining: null,
      //bliver skrevet i når man går for hurtigt
        maksHastighed: "",
      
      //viser ens gemte rejser
        trips: [],
      //brugernavn der gemmes under
        userName: "",
      //brugernavn der hentes fra
        userNameToGetBy: "",
      //hvilket id der skal slettes af tripsene
        removeTripId: null,
      //hvorvidt der blev slettet en trip eller ej
        removeTripStatus: "",
      //hvorvidt der blev tilføjet en trip eller ej
        addTripStatus: "",

      //ens nuværende hastighed baseret på målinger fra raspberryPi
        current_average_speed: 0,
      //det tidspunkt man begynder at gå
        start_time: Date(),
      //feedback på ens hastighed
        idealSpeed: "",
      
      //timerne der skal gå før alarmen skal gå
        alarm_hours: null,
      //minuterne der skal gå før alarmen skal gå
        alarm_minutes: null,
      //hvornår alarmen skal gå
        alarm_time: null,
      //hvorvidt alarmen er aktiv
        alarm_ring: false,
        alarm_set: false,
        //variabel til alarmen
        alarm_loop: 0,

      //hvorvidt man har trykket start ift at finde en rute
        active: false,

      //Pop beskeder  
        popUp_message1: "",
        popUp_message2: "",
        popUp_message2_5: "",
        popUp_message3: "",
        popUp_message4: ""
    },
    created: function () {
      //når hjemmesiden bliver startet kører vi en funktion der holder styr på at ens gennemsnitshastighed bliver regnet ud
      this.interval = setInterval(() => this.updateSpeedAsync(), 1000);
      this.getWeatherFromLatLong();
      this.getLocation();
    },
    methods: {
      //updatere gennemsnits hastigheden for brugeren
      async updateSpeedAsync(){
        if (this.active){
          let totalMeasurements : ILibrary[];
          //et kald til vores api om målinger af hastighed
          try {
            totalMeasurements = await axios.get<ILibrary[]>(baseUrl + "/brugernavn/" + "henrik").then(response => {return response.data}); //moq username / master user
          }
          catch (error: AxiosError) {
          }
          if(totalMeasurements == undefined){
            return;
          }
          let start_time : Date;
          //sletter measurements før start
          for (let index = 0; index < totalMeasurements.length; index++) {
            if(totalMeasurements[index].timestamp < start_time){
              totalMeasurements = totalMeasurements.filter(obj => obj !== totalMeasurements[index]);
              index--;
            }
          }

          //Regner total hastighed ud og dividere for at finde gennemsnittet
          let summedSpeed : number = 0
          for (let index = 0; index < totalMeasurements.length; index++) {
            summedSpeed += totalMeasurements[index].hastighed
          }
          this.current_average_speed = Math.floor(summedSpeed / totalMeasurements.length * 100) / 100;

          if (this.current_average_speed < this.hastighed) {
            this.idealSpeed = "Du går for langsomt!";
          }
          else if (this.current_average_speed <= this.hastighed+1) {
            this.idealSpeed = "Du går tilpas hurtigt";
          }
          else if(this.current_average_speed > this.hastighed+1){
            this.idealSpeed = "Du går for hurtigt!";
          }
          else {
            this.idealSpeed = "";
          }
        }
      },
      //GET Trips by UserName
      async getByUserNameAsync(userName: string) {
        try {
          return await axios.get<ITrip[]>(baseUrlTrip + "/UserName/" + userName);
        }
        catch (error: AxiosError) {
          return {data:0};
        }
      },
      //metode der sørger for at trips bliver updateret og binder med knappen i html dokumentet
      async getByUserName(url: string) {
        let response = await this.getByUserNameAsync(url);
        this.trips = response.data;

        for(let i = 0; i < response.data.length; i++) {
          let departureTime = new Date(this.trips[i].departureTime);
          let departureTimeFormatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' }).format(departureTime);
          this.trips[i].departureTime = departureTimeFormatted;

          let userDepartureTime = new Date(this.trips[i].userDepartureTime);
          let userDepartureTimeFormatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' }).format(userDepartureTime);
          this.trips[i].userDepartureTime = userDepartureTimeFormatted;
        };
      },
      //POST Trip
      async addTripAsync() {
        try {
          let postData : ITrip = {} as ITrip;
          postData.startDestination = this.afgang;
          postData.endDestination = this.ankomst;
          postData.departureTime = this.departureTime;
          postData.userDepartureTime = this.userDepartureTime;
          postData.averageSpeed = this.hastighed;
          postData.distanceToWalk = this.distance;
          postData.timeToWalk = this.timeRemaining;
          postData.userName = this.userName;
          return await axios.post<ITrip>(baseUrlTrip, postData);
        }
        catch (error: AxiosError) {
          console.log(error.message);
          this.addTripStatus = "Rejsen blev ikke gemt!"
        }
      },
      //metode der sørger for at trips bliver lavet og sendt til vores api og binder med knappen i html dokumentet
      async addTrip() {
        let response = await this.addTripAsync();
        this.addTripStatus = "Status: " + response.status + " " + response.statusText;  
      },
      //DELETE Trip
      async deleteTripAsync(deleteId: number) {
        try {
          return await axios.delete<void>(baseUrlTrip + "/" + deleteId);
        }
        catch (error: AxiosError) {
          this.removeTripStatus = error.message;
          this.removeTripStatus = "Ugyldigt ID!";
        }
      },
      //metode der sørger for at trips bliver slettet fra vores api og binder med knappen i html dokumentet
      async deleteTrip(url: string) {
        let response = await this.deleteTripAsync(url);
        this.removeTripStatus = "Status: " + response.status + " " + response.statusText;
      },
      //finder gennemsnits hastigheden man skal holde for at komme til sin destination i tide
      getHastighed(){
        //fortæller at brugeren nu skal bruge sin gennemsnits hastighed
        this.active = true;

        //sletter målinger for hastighed før dette punkt
        try {
          axios.delete(baseUrl + "/brugernavn/" + "henrik"); //moq username / master user
        }
        catch (error: AxiosError) {
        }

        //sætter tidspunktet brugeren starter med at gå til nu
        this.start_time = Date();
        
        //finder distancen der skal gås, hvis brugeren vælger et stoppested de går fra eller ej
        if (this.afgang == "")  {
          this.getDistanceFromLocation();
        }
        else {
          this.getDistance();
        }

        //tidspunktet brugeren skal være ved sit stoppested
        let departure : Date = new Date(this.departureTime);
        //nuværrende tidspunkt
        let now : Date = new Date(Date.now());
        //hvor langt tid der er til at brugeren skal være ved sin destination i timer
        let deltaTime : number = (departure.getTime() - now.getTime())/(1000 * 3600);
        //regnerhastigheden brugeren skal gå ud i km / t
        this.hastighed = Math.round((this.distance / 1000 / deltaTime) * 100)/100;

        //hvis hastigheden er under fem, skal brugeren bare gå 5km/t
        if(this.hastighed <= 5){
          this.hastighed = 5;
        }

        //hvis hastigheden  er over ti, fortæller vi brugeren at de nok ikke når det
        if(this.hastighed > 10){
          this.maksHastighed = "Vi estimerer, at du ikke vil nå dit ankomststed i tide. Vælg venligst et senere tidspunkt.";
        }
        else {
          this.maksHastighed = "";
        }
        //hvornår brugeren skal gå
        let whenToLeaveDate : Date = new Date(this.whenToLeave());
        //hvornår brugeren skal gå formatereret pænere
        let whenToLeaveDateFormatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' }).format(whenToLeaveDate);
        this.userDepartureTime = whenToLeaveDate;
        this.userDepartureTimeDisplay = whenToLeaveDateFormatted;
        //Tid tilbage i minutter
        let timeSubtract : number = Math.round(((whenToLeaveDate.getTime() - departure.getTime())/1000)/60)/-1;
        this.timeRemaining = timeSubtract;
      },
      
      //regner ud hvornår brugeren skal gå
      whenToLeave() : Date{
        let timeToArrive : number = this.distance / 1000 /this.hastighed;
        let departureTime = new Date(this.departureTime);
        let timeToLeave : Date = new Date();
        timeToLeave.setTime(departureTime.getTime() - (((timeToArrive * 60)*60)*1000));
        return timeToLeave;
      },

      //sørger for at finde stoppesteder, når man skal skrive hvor man rejser fra
      getAfgangTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            this.getAfgang();
        }, 500);
      },
      //sørger for at finde stoppesteder, når man skal skrive hvor man rejser til
      getAnkomstTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            this.getAnkomst();
        }, 500);
      },
      async asyncGetAfgang() {
        let format: string = "&format=json";
        let path: string = `https://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.afgang}&${format}`;
        try {return await axios.get<IStoppested[]>(path) } catch {}
      },
      async asyncGetAnkomst() {
        let format: string = "&format=json";
        let path: string = `https://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.ankomst}&${format}`;
        try {return await axios.get<IStoppested[]>(path) } catch {}
      },
      async getAfgang() {
        let response  = await this.asyncGetAfgang();
        this.afgang_stoppested = response.data.LocationList.StopLocation;
      },
      async getAnkomst() {
        let response  = await this.asyncGetAnkomst();
        this.ankomst_stoppested = response.data.LocationList.StopLocation;
      },

      //omregning af koordinater
      fromDmsToWgs(x:number, y:number) {
        let dms : string = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
        let wgs84 : string = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

        let convertedNum = coord(dms, wgs84, [x,y]);
        return convertedNum
      },
      fromWgsToDms(x:number, y:number) {
        let dms : string = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
        let wgs84 : string = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
        let convertedNum = coord(wgs84, dms, [x,y]);
        return convertedNum
      },

      //får brugeren position
      getLocation() {
        navigator.geolocation.getCurrentPosition(position => {  
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
        });
      },

      //regner distance ud mellem de to punkter brugeren skal gå i meter
      calculateDistance(lat1: number,lng1: number,lat2: number, lng2: number) {
          var radlat1 = Math.PI * lat1 / 180;
          var radlat2 = Math.PI * lat2 / 180;
          var theta = lng1 - lng2;
          var radtheta = Math.PI * theta / 180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          dist = Math.acos(dist);
          dist = dist * 180 / Math.PI;
          dist = dist * 60 * 1.1515;
          //Get in in kilometers
          dist = dist * 1.609344;
          //in meter
          dist = dist * 1000; 
          return dist;
      },

      //finder koordinater fra stoppestederne og finder distance derimellem
      getDistance() {
        this.selected_afgang =  this.afgang_stoppested.find( (i: any) => i.name === this.afgang);
        this.selected_ankomst = this.ankomst_stoppested.find ( (i: any) => i.name === this.ankomst); 
        var afgang_Dms = this.fromWgsToDms(Number(this.selected_afgang.y / 1000000), Number(this.selected_afgang.x / 1000000));
        var ankomst_Dms = this.fromWgsToDms(Number(this.selected_ankomst.y / 1000000), Number(this.selected_ankomst.x / 1000000));
        this.distance = Math.round(this.calculateDistance(afgang_Dms[0], afgang_Dms[1], ankomst_Dms[0], ankomst_Dms[1]))
      },
      //finder koordinater fra ens position og stoppestedet og finder distance derimellem
      getDistanceFromLocation() {
        navigator.geolocation.getCurrentPosition(position => {  
          var longitude = position.coords.longitude;
          var latitude = position.coords.latitude;
          this.selected_ankomst = this.ankomst_stoppested.find ( (i: any) => i.name === this.ankomst); 
          var ankomst_Dms = this.fromWgsToDms(Number(this.selected_ankomst.y / 1000000), Number(this.selected_ankomst.x / 1000000));

          this.distance = Math.round(this.calculateDistance(latitude, longitude, ankomst_Dms[0], ankomst_Dms[1])); 
          this.getDestWeather(this.selected_ankomst); 
        });
      },

      //sørger for kald til vores vejr api bliver lavet og formaterer dem til hjemmesiden
      async getWeatherFromLatLong(){
        let weatherData;
        let dateTime = new Date();
        let hours = dateTime.getHours().toString();
        let minutes = dateTime.getMinutes().toString();
        if(hours.length == 1){
          hours = "0" + hours;
        }
        if(minutes.length == 1){
          minutes = "0" + minutes;
        }
        navigator.geolocation.getCurrentPosition(async position => {  
          let path = openWeatherBaseUrl + openWeatherLat + position.coords.latitude + openWeatherLong + position.coords.longitude + openWeatherApiKey;
          await axios
          .get(path)
          .then(response => {
            weatherData = response.data.main;
            this.current_city = response.data.name;
            this.temperature = (weatherData.temp - 273).toFixed(2);
            this.feels_like = (weatherData.feels_like - 273).toFixed(2);
            this.humidity = weatherData.humidity;
            this.pressure = weatherData.pressure;
            this.wind_speed = response.data.wind.speed;
            this.wind_degree = response.data.wind.deg;
            this.weather_type = response.data.weather[0].main;
            this.current_dateTime = `${dateTime.toLocaleString('en-us', {  weekday: 'long' })} ${hours + ":" + minutes}`;
          });
        });
      },

      //skriver notification data ind i popup
      alertNotification(trip:ITrip){
        if(this.trips != null && this.trips.length > 0){
          let message1 = `${trip.startDestination} - ${trip.endDestination}`;
          let message2 = `Du skulle have været ved dit stop ${trip.departureTime}`;
          let message2_5 = `Et stop på din rejse er forsinket, så afgangstidspunktet udskydes`;
          let message3 = `Du skal derfor tage afsted: ${trip.userDepartureTime}`;
          let message4 = `+ ${delayedTime} min`;
          this.popUp_message1 = message1;
          this.popUp_message2 = message2;
          this.popUp_message2_5 = message2_5;
          this.popUp_message3 = message3;
          this.popUp_message4 = message4;
        }
      },

      //sørger for kald til vores vejr api bliver lavet og formaterer dem til hjemmesiden
      async getDestWeather(destination:any){
        let coords = this.fromWgsToDms(Number(destination.y / 1000000), Number(destination.x / 1000000));
        let lat = coords[0];
        let lng = coords[1];
        let path = openWeatherBaseUrl + openWeatherLat + lat + openWeatherLong + lng + openWeatherApiKey;
        let dateTime = new Date();
        let hours = dateTime.getHours().toString();
        let minutes = dateTime.getMinutes().toString();
        if(hours.length == 1){
          hours = "0" + hours;
        }
        if(minutes.length == 1){
          minutes = "0" + minutes;
        }
        await axios
        .get(path)
        .then(response => {
          let weatherData = response.data.main;
          this.dest_current_city = response.data.name;
          this.dest_temperature = (weatherData.temp - 273).toFixed(2);
          this.dest_feels_like = (weatherData.feels_like - 273).toFixed(2);
          this.dest_humidity = weatherData.humidity;
          this.dest_pressure = weatherData.pressure;
          this.dest_wind_speed = response.data.wind.speed;
          this.dest_wind_degree = response.data.wind.deg;
          this.dest_weather_type = response.data.weather[0].main;
          this.dest_current_dateTime = `${dateTime.toLocaleString('en-us', {  weekday: 'long' })} ${hours + ":" + minutes}`;
        })
      },

      //set en alarm til at kører om et given stykke tid
      ringAlarm(){
        var date = new Date();
        var time_now_hours = date.getHours().toString();
        var time_now_minutes = date.getMinutes().toString();

        if(time_now_hours.length == 1){
          time_now_hours = "0" + time_now_hours;
        }
        if(time_now_minutes.length == 1){
          time_now_minutes = "0" + time_now_minutes;
        }
        var time_now = time_now_hours + ":" + time_now_minutes;

        if(this.alarm_set == false){
          if(this.alarm_hours.toString().length > 0 && this.alarm_hours.toString().length <= 2){
            if(this.alarm_hours.length == 1){
              this.alarm_hours = "0" + this.alarm_hours;
            }
            if(this.alarm_minutes.toString().length > 0 && this.alarm_minutes.toString().length <= 2){
              if(this.alarm_minutes.length == 1){
                this.alarm_minutes = "0" + this.alarm_minutes;
              }
              this.alarm_time = this.alarm_hours + ":" + this.alarm_minutes;
  
              this.alarm_set = true;
              if(this.alarm_ring == false){
                this.alarm_ring = true;
                alert("Alarm set!");
              }
            }else{
              alert("Enter minutes correct");
            }
          }else{
            alert("Enter hours correct");
          }
        }

        if(this.alarm_ring == true){
          if(time_now === this.alarm_time){
            alert("DING DONG DING DONG")
            this.alarm_time = "";
            this.alarm_set = false;
            this.alarm_ring = false;
            clearTimeout(this.alarm_loop);
          }else{
            this.alarm_loop = setTimeout(this.ringAlarm, 1000);
          }
        }
      },

      //stopper alarmen
      cancelAlarm(){
        this.alarm_set = false;
        if(this.alarm_ring == true){
          this.alarm_ring = false;
        }
        clearTimeout(this.alarm_loop);
        alert("Alarm cancelled!");
      },

      //Popup
      openPopup(trip:ITrip){
        this.alertNotification(trip)
        console.log("yeehaw");
        const popup = <HTMLDivElement>document.getElementById('popUp');
        popup.classList.remove('invis')
        popup.classList.add('show');
      },
      closePopup(){
        const popup = <HTMLDivElement>document.getElementById('popUp');
        popup.classList.remove('show')
        popup.classList.add('invis');
      }
    }
})
