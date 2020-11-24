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
        styleObject: {
            background: 'red',
            color: 'white',
            fontSize: '20px'
        },
        search: ""
    },
    methods: {
        async getLibraryAsync(){
            try {
                axios.get<ILibrary[]>(baseUrl, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {this.librarys = result.data;})
                .catch(error => {return []});

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
                this.librarys = []
                this.getAllSearch("hastighed=" + this.search);
                this.getAllSearch("brugernavn=" + this.search);
                if(isNaN(this.search) == false){
                    this.getAllSearch("yearofpublication=" + this.search);
                }
            }
        },
        async getSearch(searchString : string){
            let returnData : ILibrary[] = [];
            try {
                axios.get<ILibrary[]>(baseUrl + "/search?" + searchString, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {this.librarys = result.data;})
                .catch(error => {return []});

            }
            catch ( error: AxiosError){
                this.message = error.message;
                alert(error.message);
            }
        },
        async getAllSearch(searchString : string){
            let returnData : ILibrary[] = [];
            try {
                axios.get<ILibrary[]>(baseUrl + "/search?" + searchString, {headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS","Access-Control-Allow-Credentials": "true"} } )
                .then(result => {
                for (let dataIndex = 0; dataIndex < result.data.length; dataIndex++) {
                    let exist : boolean = false;
                    for (let librarysIndex = 0; librarysIndex < this.librarys.length; librarysIndex++) {
                        if (result.data[dataIndex].brugernavn == this.librarys[librarysIndex].brugernavn){
                            exist = true;
                            break;
                        }
                    }
                    if(exist == false){
                        this.librarys.push(result.data[dataIndex]);
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
        this.getLibraryAsync();
        // this.interval = setInterval(() => this.getLibraryAsync(), 10000);
    }
})

