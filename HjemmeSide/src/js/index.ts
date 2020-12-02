import coord from "proj4";
import Axios from "../../node_modules/axios/index";

import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


interface ILibrary {
    "brugernavn": string,
    "hastighed": number,
    "timestamp": Date,
    "id": number
}
interface IStoppested {
  name: string,
  x: string,
  y: string,
  id: Number,
}

Vue.component('v-select', VueSelect.VueSelect)

Vue.component('library', {
    props: ['library'],
    methods: {
    },
    template: `
        <div class="jumbotron library">
            <h1>{{ library.brugernavn }}</h1>
            <div class="hastighed-row">
                <h2 class="library-stat">Hastighed:</h2>
                <h2 class="library-info">{{ library.hastighed }}</h2>
            </div>
            <div class="hastighed-row">
                <h2 class="library-stat">TimeStamp:</h2>
                <h2 class="library-info">{{ library.timestamp }}</h2>
            </div>
            <div class="hastighed-row">
                <h2 class="library-stat">Year of publication:</h2>
                <h2 class="library-info">{{ library.id }}</h2>
            </div>
        </div>
    `
})

let baseUrl = 'http://localhost:49606/api/Libraries';

let openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?"
let openWeatherLat = "lat="
let openWeatherLong = "&lon="
let openWeatherApiKey = "&appid=412be2f2e33e80c87ba34e35ac054489"

let rejseplanenbaseurl: string = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
let format: string = "&format=json";

var dms = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
var utm = "+proj=utm +zone=32N +etrs=1989";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

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


var main = new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        librarys: [],
        locationArray: [],
        search: "",
        afgang: "",
        ankomst: "",
        hastighed: null,
        departureTime: null,
        distance: null,
        longitude: null,
        latitude: null,
        afgang_stoppested: [],
        ankomst_stoppested: [],
        selected_afgang: null,
        selected_ankomst: null,
        temperature: null,
        feels_like: null,
        wind_speed: null,
        wind_degree: null,
        humidity: null,
        pressure: null,
        weather_type: "",
        current_city: "",
        current_dateTime: ""
    },
    methods: {
        async getLibraryAsync(){
            try {
                axios.get<ILibrary[]>(baseUrl + "/brugernavn/" + this.search, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } ).then().catch(error => this.librarys = [])
                .then(result => {this.librarys = result.data;})
                .catch(error => {return []});

            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        },
        async deleteLibraryAsync(){
            try {
                axios.delete(baseUrl + "/brugernavn/" + this.search, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } ).then(error => this.librarys = []).catch(error => this.librarys = [])
            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        },
        getHastighed(){
            if (this.afgang == "") {
              this.getDistanceFromLocation();
            }
            else {
              this.getDistance();
            }
            let departure : Date = new Date(this.departureTime);
            let now : Date = new Date(Date.now());
            let deltaTime : number = (departure.getTime() - now.getTime())/(1000 * 3600);
            this.hastighed = Math.round((this.distance / 1000 / deltaTime) * 10)/10;
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
        getNearbyStops(x:number, y:number) {
          let path: string = rejseplanenbaseurl + `/stopsNearby?coordX=${x}&coordY=${y}${format}`
          axios
          .get(path)
          .then(response=> {
            let newLocation: Location;
            response.data.LocationList.StopLocation.forEach((location:any) => {
              newLocation = new Location(location.name, this.fromWgsToDms(Number(location.y / 1000000), Number(location.x / 1000000)), location.distance);
              this.locationArray.push(newLocation)
            });
          })
          console.log(this.locationArray)
        },
        async asyncGetAfgang() {
          let path: string = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.afgang}&${format}`;
          try {return await axios.get<IStoppested[]>(path) }
        },
        async asyncGetAnkomst() {
          let path: string = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${this.ankomst}&${format}`;
          try {return await axios.get<IStoppested[]>(path) }
        },
        async getAfgang() {
          let response  = await this.asyncGetAfgang();
          console.log(response.data.LocationList.StopLocation);
          this.afgang_stoppested = response.data.LocationList.StopLocation;
        },
        async getAnkomst() {
          let response  = await this.asyncGetAnkomst();
          console.log(response.data.LocationList.StopLocation)
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
            console.log(position.coords.longitude, position.coords.latitude); 
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;

            this.selected_ankomst = this.ankomst_stoppested.find ( (i: any) => i.name === this.ankomst); 
            var ankomst_Dms = this.fromWgsToDms(Number(this.selected_ankomst.y / 1000000), Number(this.selected_ankomst.x / 1000000));
  
            this.distance = Math.round(this.calculateDistance(latitude, longitude, ankomst_Dms[0], ankomst_Dms[1]));  
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
              console.log(response.data);
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
            })
          });

        }
      }
    }
})

main.getLocation();
main.getWeatherFromLatLong();

