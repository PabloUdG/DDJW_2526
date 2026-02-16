addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        let jugador = prompt("Introdueix el teu nom:", "Jugador")
        console.log("Nom del jugador: " + jugador)
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});