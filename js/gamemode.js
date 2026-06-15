import {$} from "../library/jquery-4.0.0.slim.module.min.js";

let options = JSON.parse(localStorage.options);
console.log(options);

$('#estandar').on('click', function(){
    options.gamemode = 'estandar';
    localStorage.options = JSON.stringify(options);
    window.location.assign("./canvasgame.html");
});

$('#infinit').on('click', function(){
    options.gamemode = 'infinit';
    localStorage.options = JSON.stringify(options);
    window.location.assign("./canvasgame.html");
});