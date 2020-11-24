import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


interface IRecord {
    "title": string,
    "artist": string,
    "duration": number,
    "yearOfPublication": number,
    "numberOfTracks": number
}
Vue.component('record', {
    props: ['record'],
    methods: {
    },
    template: `
        <div class="jumbotron record">
            <h1>{{ record.title }}</h1>
            <div class="artist-row">
                <h2 class="record-stat">Artist:</h2>
                <h2 class="record-info">{{ record.artist }}</h2>
            </div>
            <div class="artist-row">
                <h2 class="record-stat">Duration:</h2>
                <h2 class="record-info">{{ Math.ceil(record.duration / 60) }} min</h2>
            </div>
            <div class="artist-row">
                <h2 class="record-stat">Year of publication:</h2>
                <h2 class="record-info">{{ record.yearOfPublication }}</h2>
            </div>
            <div class="artist-row">
                <h2 class="record-stat">Number of tracks:</h2>
                <h2 class="record-info">{{ record.numberOfTracks }}</h2>
            </div>
        </div>
    `
})

let baseUrl = 'https://restapidr.azurewebsites.net/record';

new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        records: [],
        styleObject: {
            background: 'red',
            color: 'white',
            fontSize: '20px'
        },
        search: ""
    },
    methods: {
        async getRecordAsync(){
            try {
                axios.get<IRecord[]>(baseUrl, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {this.records = result.data;})
                .catch(error => {return error});

            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        },
        async getSearchedItems(){
            let searchVar : string;
            if(this.search.includes("=")){
                searchVar = this.search;
                searchVar = searchVar.replace(" ","&");
                this.getSearch(searchVar);
            }
            else{
                this.records = []
                this.getAllSearch("artist=" + this.search);
                this.getAllSearch("title=" + this.search);
                if(isNaN(this.search) == false){
                    this.getAllSearch("yearofpublication=" + this.search);
                }
            }
        },
        async getSearch(searchString : string){
            let returnData : IRecord[] = [];
            try {
                axios.get<IRecord[]>(baseUrl + "/search?" + searchString, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {this.records = result.data;})
                .catch(error => {return []});

            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        },
        async getAllSearch(searchString : string){
            let returnData : IRecord[] = [];
            try {
                axios.get<IRecord[]>(baseUrl + "/search?" + searchString, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {
                for (let dataIndex = 0; dataIndex < result.data.length; dataIndex++) {
                    let exist : boolean = false;
                    for (let recordsIndex = 0; recordsIndex < this.records.length; recordsIndex++) {
                        if (result.data[dataIndex].title == this.records[recordsIndex].title){
                            exist = true;
                            break;
                        }
                    }
                    if(exist == false){
                        this.records.push(result.data[dataIndex]);
                    }
                }})
                .catch(error => {return []});

            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        }
    },
    created() {
        this.getRecordAsync();
        // this.interval = setInterval(() => this.getRecordAsync(), 10000);
    }
})

