//Koordinat support
import coord from "proj4";

//https request support
import Axios from "../../node_modules/axios/index";
import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

//url til hastigheds målinger
let baseUrl = 'https://rejseplanenapi20201207103315.azurewebsites.net/api/libraries/';
//url til gemte rejser
let baseUrlTrip = 'https://rejseplanenapi20201207103315.azurewebsites.net/api/Trip/';

//url support til vejr api
let openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?"
let openWeatherLat = "lat="
let openWeatherLong = "&lon="
let openWeatherApiKey = "&appid=412be2f2e33e80c87ba34e35ac054489"

//url support til rejseplanens api
let rejseplanenbaseurl: string = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
let format: string = "&format=json";

//formater til rejseplanens api
var dms = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
var utm = "+proj=utm +zone=32N +etrs=1989";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

//variabel til alarmen
var alarm_loop: number;

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

//Component til visning af hastigheds målinger
// Vue.component('library', {
//     props: ['library'],
//     methods: {
//     },
//     template: `
//         <div class="jumbotron library">
//             <h1>{{ library.brugernavn }}</h1>
//             <div class="hastighed-row">
//                 <h2 class="library-stat">Hastighed:</h2>
//                 <h2 class="library-info">{{ library.hastighed }}</h2>
//             </div>
//             <div class="hastighed-row">
//                 <h2 class="library-stat">TimeStamp:</h2>
//                 <h2 class="library-info">{{ library.timestamp }}</h2>
//             </div>
//             <div class="hastighed-row">
//                 <h2 class="library-stat">Year of publication:</h2>
//                 <h2 class="library-info">{{ library.id }}</h2>
//             </div>
//         </div>
//     `
// })

//vue object
var main = new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",

    //Alt dataen der bruges i sammenhæng med vue
    data: {
      //bruges til visning af hastigheds målinger
        //librarys: [],
        // search: "",
      //bruges i forbindelse med at finde stopsteder i nærheden
        // locationArray: [],

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

      //hvorvidt man har trykket start ift at finde en rute
        active: false
    },
    created: function () {
      this.interval = setInterval(() => this.updateSpeedAsync(), 1000);
    },
    methods: {
      //updates the current speed of the master user
      async updateSpeedAsync(){
        if (this.active){
          let totalMeasurements : ILibrary[];
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
      async getByUserName(url: string) {
        let response = await this.getByUserNameAsync(url);
        this.trips = response.data;
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
      async deleteTrip(url: string) {
        let response = await this.deleteTripAsync(url);
        this.removeTripStatus = "Status: " + response.status + " " + response.statusText;
      },
      // async getLibraryAsync(){
      //     try {
      //         axios.get<ILibrary[]>(baseUrl + "/brugernavn/" + this.search, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } ).then().catch(error => this.librarys = [])
      //         .then(result => {this.librarys = result.data;})
      //         .catch(error => {return []});
      //     }
      //     catch ( error: AxiosError){
      //         this.message = error.message;
      //         alert(error.message);
      //     }
      // },
      // async deleteLibraryAsync(){
      //     try {
      //         axios.delete(baseUrl + "/brugernavn/" + this.search, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } ).then(error => this.librarys = []).catch(error => this.librarys = [])
      //     }
      //     catch ( error: AxiosError){
      //         this.message = error.message;
      //         alert(error.message);
      //     }
      // },
      getHastighed(){
        this.active = true;
        try {
          axios.delete(baseUrl + "/brugernavn/" + "henrik"); //moq username / master user
        }
        catch (error: AxiosError) {
        }
        this.start_time = Date();
        

        if (this.afgang == "")  {
            this.getDistanceFromLocation();
          }
          else {
            this.getDistance();
          }
          let departure : Date = new Date(this.departureTime);
          let now : Date = new Date(Date.now());
          let deltaTime : number = (departure.getTime() - now.getTime())/(1000 * 3600);
          this.hastighed = Math.round((this.distance / 1000 / deltaTime) * 100)/100;
          if(this.hastighed <= 5){
            this.hastighed = 5;
          }
          if(this.hastighed > 10){
            this.maksHastighed = "Vi estimerer, at du ikke vil nå dit ankomststed i tide. Vælg venligst et senere tidspunkt.";
          }
          else {
            this.maksHastighed = "";
          }
          let whenToLeaveDate : Date = new Date(this.whenToLeave());
          let whenToLeaveDateFormatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' }).format(whenToLeaveDate);
          this.userDepartureTime = whenToLeaveDate;
          this.userDepartureTimeDisplay = whenToLeaveDateFormatted;
          //Tid tilbage i minutter
          let timeSubtract : number = Math.round(((whenToLeaveDate.getTime() - departure.getTime())/1000)/60)/-1;
          this.timeRemaining = timeSubtract;
      },
      whenToLeave() : Date{
        let timeToArrive : number = this.distance / 1000 /this.hastighed;
        let departureTime = new Date(this.departureTime);
        let timeToLeave : Date = new Date();
        timeToLeave.setTime(departureTime.getTime() - (((timeToArrive * 60)*60)*1000));
        return timeToLeave;
      },
      getAfgangTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            this.getAfgang();
        }, 500);
      },
      getAnkomstTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            this.getAnkomst();
        }, 500);
      },        
      // getNearbyStops(x:number, y:number) {
      //   let path: string = rejseplanenbaseurl + `/stopsNearby?coordX=${x}&coordY=${y}${format}`
      //   axios
      //   .get(path)
      //   .then(response=> {
      //     let newLocation: Location;
      //     response.data.LocationList.StopLocation.forEach((location:any) => {
      //       newLocation = new Location(location.name, this.fromWgsToDms(Number(location.y / 1000000), Number(location.x / 1000000)), location.distance);
      //       this.locationArray.push(newLocation)
      //     });
      //   })
      // },
      async asyncGetAfgang() {
        let path: string = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.afgang}&${format}`;
        try {return await axios.get<IStoppested[]>(path) } catch {}
      },
      async asyncGetAnkomst() {
        let path: string = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.ankomst}&${format}`;
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
      fromDmsToWgs(x:number, y:number) {
        let convertedNum = coord(dms, wgs84, [x,y]);
        return convertedNum
      },
      fromWgsToDms(x:number, y:number) {
        let convertedNum = coord(wgs84, dms, [x,y]);
        return convertedNum
      },
      getLocation() {
        navigator.geolocation.getCurrentPosition(position => {  
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          //this.afgang = position.coords.longitude.toString() + " "  + position.coords.latitude.toString();
        });
      },
      calculateDistance(lat1: number,lng1: number,lat2: number, lng2: number) {
          var radlat1 = Math.PI * lat1 / 180;
          var radlat2 = Math.PI * lat2 / 180;
          var radlon1 = Math.PI * lng1 / 180;
          var radlon2 = Math.PI * lng2 / 180;
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
      getDistance() {
        this.selected_afgang =  this.afgang_stoppested.find( (i: any) => i.name === this.afgang);
        this.selected_ankomst = this.ankomst_stoppested.find ( (i: any) => i.name === this.ankomst); 
        var afgang_Dms = this.fromWgsToDms(Number(this.selected_afgang.y / 1000000), Number(this.selected_afgang.x / 1000000));
        var ankomst_Dms = this.fromWgsToDms(Number(this.selected_ankomst.y / 1000000), Number(this.selected_ankomst.x / 1000000));
        this.distance = Math.round(this.calculateDistance(afgang_Dms[0], afgang_Dms[1], ankomst_Dms[0], ankomst_Dms[1]))
      },
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
        }
      },
      AddMinutesToDate(date:any, minutes:any) {
          return new Date(date.getTime() + minutes*60000);
      },
      alertNotification(trip:ITrip){
        if(this.trips != null && this.trips.length > 0){
          let oldTime = new Date(trip.userDepartureTime);
          let newTime = new Date(this.AddMinutesToDate(oldTime, 5));
          let message1 = `${trip.startDestination} - ${trip.endDestination} \nDu skulle havde været ved dit stop ${trip.departureTime} \nEt stop på din rejse er forsinket`;
          let message2 = `Din nye afgangstid er: ${newTime.toString()}`
          alert(message1 + "\n" + message2);
        }
      },
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
            clearTimeout(alarm_loop);
          }else{
            alarm_loop = setTimeout(this.ringAlarm, 1000);
          }
        }
      },
      cancelAlarm(){
        this.alarm_set = false;
        if(this.alarm_ring == true){
          this.alarm_ring = false;
        }
        clearTimeout(alarm_loop);
        alert("Alarm cancelled!");
      }
    }
})

main.getLocation();
main.getWeatherFromLatLong();
