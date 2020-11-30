import coord from "proj4";


import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


interface ILibrary {
    "brugernavn": string,
    "hastighed": number,
    "timestamp": Date,
    "id": number
}
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

new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        librarys: [],
        search: "",
        hastighed: null,
        departureTime: null,
        distance: null,
        userDepartureTime: null        
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
            this.hastighed = Math.round((this.distance / 1000 / deltaTime) * 100)/100;
            if(this.hastighed <= 5){
              this.hastighed = 5;
            }
            this.userDepartureTime = new Date(this.whenToLeave()).toUTCString();
        },
        whenToLeave() : Date{
          let timeToArrive : number = this.distance / 1000 /this.hastighed;
          let departureTime = new Date(this.departureTime);
          let timeToLeave : Date = new Date();
          timeToLeave.setTime(departureTime.getTime() - (((timeToArrive * 60)*60)*1000));
          return timeToLeave;
        }   
    },
    created() {
        // this.interval = setInterval(() => this.getHastighed(), 10);
    }
})



let rejseplanenbaseurl: string = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
let format: string = "&format=json";

var dms = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
var utm = "+proj=utm +zone=32N +etrs=1989";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

let locationArray: Array<Location> = []

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

async function getNearbyStops(x:number, y:number): Promise<void>{
  let path: string = rejseplanenbaseurl + `/stopsNearby?coordX=${x}&coordY=${y}${format}`
  await axios
  .get(path)
  .then(response=> {
    let newLocation: Location;
    response.data.LocationList.StopLocation.forEach((location:any) => {
      newLocation = new Location(location.name, fromWgsToDms(Number(location.y / 1000000), Number(location.x / 1000000)), location.distance);
      locationArray.push(newLocation)
    });
  })
  console.log(locationArray)
}

function fromDmsToWgs(x:number, y:number): Array<number>{
  let convertedNum = coord(dms, wgs84, [x,y]);
  return convertedNum
}

function fromWgsToDms(x:number, y:number): Array<number>{
  let convertedNum = coord(wgs84, dms, [x,y]);
  return convertedNum
}

//getNearbyStops(55673059,12565557)

async function getLocation(): Promise<void> {
  await navigator.geolocation.getCurrentPosition(position => {  
    console.log(position); 

    getNearbyStops(position.coords.longitude, position.coords.latitude)
    //getTrip(position.coords.longitude, position.coords.latitude)

    return null
  });
}

async function getTrip(dude:number, dude2:number): Promise<void>{
  let path = rejseplanenbaseurl + `/trip?originId=8600626&destCoordX=<55>&destCoordY=<12>&destCoordName=<RoskildeSt.>&format=json`
  await axios
  .get(path)
  .then(response => {
    console.log(path)
  })
}
// getLocation(); 
