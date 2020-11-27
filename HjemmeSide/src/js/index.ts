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
        }
    },
    created() {
        // this.interval = setInterval(() => this.getLibraryAsync(), 10000);
    }
})

