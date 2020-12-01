import coord from "proj4";

import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


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


new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        librarys: [],
        locationArray: [],
        afgang: "",
        ankomst: "",
        hastighed: null,
        departureTime: null,
        distance: null,
        longitude: null,
        latitude: null,
        afgang_stoppested: [],
        ankomst_stoppested: []
    },
    created: function () {
      // `this` points to the vm instance
      this.getLocation()
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
            let departure : Date = new Date(this.departureTime);
            let now : Date = new Date(Date.now());
            let deltaTime : number = (departure.getTime() - now.getTime())/(1000 * 3600);
            this.hastighed = Math.round((this.distance / 1000 / deltaTime) * 10)/10;
        },
        created() {
            // this.interval = setInterval(() => this.getHastighed(), 10);
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
            console.log(position.coords.longitude, position.coords.latitude); 
            this.longitude = position.coords.longitude;
            this.latitude = position.coords.latitude;

            return [position.coords.longitude, position.coords.latitude]
        
            //getNearbyStops(position.coords.longitude, position.coords.latitude)
            //getTrip(position.coords.longitude, position.coords.latitude)
        
          });
        },
        getDistance(location: string) {
          if (this.latitude == null || this.longitude == null) {
            this.getLocation()
            this.getNearbyStops(this.longitude, this.latitude)
          }
          else {
            this.getNearbyStops(this.longitude, this.latitude);

          }          

        }
      }
    }
})

