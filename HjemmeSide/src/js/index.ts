import Axios from "axios";
import coord from "proj4";


let baseurl: string = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
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
  let path: string = baseurl + `/stopsNearby?coordX=${x}&coordY=${y}${format}`
  await Axios
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
    getTrip(position.coords.longitude, position.coords.latitude)

    return null
  });
}

async function getTrip(dude:number, dude2:number): Promise<void>{
  let path = baseurl + `/trip?originId=8600626&destCoordX=<55>&destCoordY=<12>&destCoordName=<RoskildeSt.>&format=json`
  await Axios
  .get(path)
  .then(response => {
    console.log(path)
  })
}
getLocation();
