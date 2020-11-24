new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        dogs: [],
        methodType: "",
        showing: false,
        sayHello: "Say hello"
    },
    methods: {
        show() {
            if(this.methodType == "frejaMode"){
                this.showing = false
                if(this.dogs.length == generateDogs().length){
                    this.dogs = []
                }
                this.dogs.push(generateDog(this.dogs))
            }
            else if(this.methodType == "frejaMode2"){
                this.showing = false
                this.dogs = []
                this.dogs.push(generateDog(this.dogs))
            }
            else if (!this.showing) {
                // generateDogs().forEach(element => {
                //     this.dogs.push({id: element.Id, img: element.Img})
                // })
                this.dogs = generateDogs()
                this.showing = true
                this.sayHello = "Say bye" //Maybe make whole text and show/hide
            }
            else{
                this.dogs = []
                this.showing = false
                this.sayHello = "Say hello"
            }
        }
    }
});
import Dog from "./dog";
function generateDogs() : Dog[] {
    let dogArray : Dog[];
    dogArray = [];
    for (var _i = 0; _i < 81; _i++){
        dogArray.push(new Dog(_i,('/HundePictures/' + (_i+1).toString() + '.jpg')))
    }
    return dogArray; 
}
function generateDog(dogs : Dog[]){
    let allDogs = generateDogs()
    dogs.forEach(element => {
        allDogs = allDogs.filter(item => item !=element);
    });
    if(allDogs.length != 0)
    {
        return allDogs[getRandomInt(allDogs.length)]
    }
    return new Dog(-1,"");
    
}
function getRandomInt(max : number) {
    return Math.floor(Math.random() * Math.floor(max));
}
