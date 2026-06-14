const resources = ['../resources/cn.svg', '../resources/cv.svg',
                '../resources/dn.svg', '../resources/dv.svg',
                '../resources/pn.svg', '../resources/pv.svg',
                '../resources/tn.svg', '../resources/tv.svg'];
const back = '../resources/back.svg';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var options = JSON.parse(localStorage.options);


var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    previousCards: [],
    score: 200,
    pairs: options.pairs,
    group: options.groupSize,
    difficulty: options.difficulty,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.previousCards = toLoad.previousCards;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.group = toLoad.group;
            this.difficulty = toLoad.difficulty;
        }
        else{ // Nova partida
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.pairs);
            for (let index = 0; index < this.group-1; index++) { //-1 per les cartes que ja estan inicialment en el array
                this.items = this.items.concat(this.items);        
            }
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx + 50 * this.group);
            }
        });
    },
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
        if (this.previousCards.length === 0) this.previousCards.push(indx); // Primera carta clicada
        else if(this.previousCards.length < this.group){ 
            if (this.items[this.previousCards[this.previousCards.length-1]] === this.items[indx]){
                this.previousCards.push(indx)
            }else{
                this.goBack(indx);
                this.previousCards.forEach((element) => { this.goBack(element) });
                this.previousCards = [];
            }
        }else{ // Teníem carta prèvia
            if (this.items[this.previousCards[this.previousCards.length-1]] === this.items[indx]){
                this.pairs--;
                this.states[indx] = StateCard.DONE;
                this.previousCards.forEach((element) => { this.states[element] = StateCard.DONE });
                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            }
            else {
                this.goBack(indx);
                this.previousCards.forEach((element) => { this.goBack(element) });
                this.score -= 25;
                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }
            this.previousCards = [];
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            previousCards: this.previousCards,
            score: this.score,
            pairs: this.pairs,
            group: this.group,
            difficulty: this.difficulty
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}