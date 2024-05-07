let socket = io();

// function verifyAdmin() {
//     let data = getCookie("user");
//     return data == "$2a$10$S71t6BVaKWDDPEmietxwme0dN81mzhz5M0mL0LUUA6LqohqfV0Cmq";
// }

document.addEventListener("contextmenu", (e) => {
    resetBrackets(e);
    e.preventDefault();
});

document.addEventListener("click", (e) => {
    // console.log(e.target);
    resetBrackets(e);
    // console.log(e.target);
    // if (e.target.classList.contains("data-edit")) {
    //     let dataToEdit = e.target.id.split("-");
    //     switch (dataToEdit[0]) {
    //         case "schedule":
    //             console.log("Schedule");
    //             break;
    //         case "civdraft":
    //             console.log("civdraft");
    //             break;
    //         case "mapdraft":
    //             console.log("mapdraft");
    //             break;
    //         case "result":
    //             console.log("result");
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // e.preventDefault();
});

function resetBrackets(e) {
    if (!e.target.classList.contains("fa-times-circle") && !e.target.classList.contains("fa-check-square")) {
        let matches = document.querySelectorAll(".show");
        matches.forEach((match) => {
            if (e.target != match && !match.contains(e.target) ) {
                match.classList.remove('show');
            }
        });
    }
}



window.addEventListener("load", async function(){


    let validator = document.querySelector("#validator");
    // let admin = false;
    validator.addEventListener("dblclick", ()=> {
        // if (!verifyAdmin()) {
            toggleAdminLogin()
        // }
        
    })


    let categorySelector = document.querySelector("#tier-selector");

    let playerList 
    // if (!sessionStorage.getItem("playerList")) {
    playerList = await fetch(`/api/show-data`);
    playerList = await playerList.json();

    let brackets = playerList.data.partidas;
    let tempPartidas = [];

    playerList = playerList.data.jugadores;
    let tempJugadores = [];
    // console.log(playerList);

    function buscarPartida(id) {
        // let tempPartidas
        let partidas = JSON.parse(sessionStorage.getItem("partidas"));
        // console.log(id, partidas);
        return partidas.find(partida => partida.id == id) || {jugadorUno: {id: null}, jugadorDos: {id: null}};
    };

    function buscarJugador(id) {
        let jugadores = JSON.parse(sessionStorage.getItem("jugadores"));
        return jugadores.find(jugador => jugador.id == id);
    }

    async function actualizarListaJugadores(jugadores) {
        // console.log(jugador, slot, partida);
        let newBrackets = brackets.map(match => {
            match.ganador = null;
            match.jugadorUno = {id: null, score: 0}
            match.jugadorDos = {id: null, score: 0}
            match.caracteristicas.civ_draft = null;
            match.caracteristicas.map_draft = null;
            match.caracteristicas.horario = null;
            return match;
        })
        // console.log(newBrackets);
        let data = {
            partidas: newBrackets,
            jugadores: jugadores
        }

        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        mostrarContenido(window.location.pathname);

        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);

        await fetch('/api/update-match-info',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: JSON.stringify(data)})
        })
    }

    async function asignarJugador(jugador, slot, partida) {
        // console.log(jugador, slot, partida);
        let newBrackets = brackets.map(match => {
            // console.log(match.id, partida);
            if (jugador == match.jugadorUno.id) {
                match.jugadorUno.id = null;
            } else if (jugador == match.jugadorDos.id) {
                match.jugadorDos.id = null;
            }
            
            if (match.id == partida){
                // console.log(slot);
                if (slot == "uno") {
                    match.jugadorUno.id = jugador;
                } else {
                    match.jugadorDos.id = jugador;
                };
            };
            return match;
        })
        // console.log(newBrackets);
        let data = {
            partidas: newBrackets,
            jugadores: playerList
        }

        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        mostrarContenido(window.location.pathname);

        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);

        await fetch('/api/update-match-info',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: JSON.stringify(data)})
        })
    }

    // actualizarNick(player.id,td.querySelector("#update-nick").value);
    async function actualizarNick(playerId, newName) {
        let newPlayers = playerList.map((player)=>{
            if (player.id == playerId) {
                player.nick = newName;
            };
            return player;
        });

        // console.log(newBrackets);
        let data = {
            partidas: brackets,
            jugadores: newPlayers
        }

        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        mostrarContenido(window.location.pathname);

        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);

        await fetch('/api/update-match-info',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: JSON.stringify(data)})
        })

        cargarCategoria(categorySelector.value);
    }

    async function actualizarInfoPartida(clave, valor, partida) {
        // console.log(jugador, slot, partida);
        let newBrackets = brackets.map(match => {
            if(match.id == partida){
                match.caracteristicas[clave] = valor;
            };
            return match;
        })

        // console.log(newBrackets);
        let data = {
            partidas: newBrackets,
            jugadores: playerList
        }

        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        mostrarContenido(window.location.pathname);

        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);

        // console.log(clave, valor, partida);
        await fetch('/api/update-match-info',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: JSON.stringify(data)})
        })
    }

    async function actualizarScorePartida(partida, scores) {
        // console.log(jugador, slot, partida);
        let winner;
        let newBrackets = brackets.map(match => {
            if(match.id == partida){
                if (scores.jugadorUno == scores.jugadorDos) {
                    match.jugadorUno.score = 0;
                    match.jugadorDos.score = 0;
                } else {
                    match.jugadorUno.score = scores.jugadorUno;
                    match.jugadorDos.score = scores.jugadorDos;
                }
                if (scores.jugadorUno > scores.jugadorDos) {
                    match.ganador = match.jugadorUno.id;
                    winner = match.jugadorUno.id;
                } else if (scores.jugadorDos > scores.jugadorUno) {
                    match.ganador = match.jugadorDos.id;
                    winner = match.jugadorDos.id;
                } else {
                    match.ganador = null;
                }
            };
            return match;
        })
        
        // Si etapa == 1 
        // Debo buscar el índice dentro de tempPartidas de la partida actual
        // Si el índice es 0, a la partida con índice 8, jugadorUno, le corresponde el ganador
        // Si el índice es 1, a la partida con índice 8, jugadorDos, le corresponde el ganador
        // Si el índice es 2, a la partida con índice 9, jugadorUno, le corresponde el ganador
        // Si el índice es 3, a la partida con índice 9, jugadorDos, le corresponde el ganador
        let result = 8 + ((partida * 0.5)-0.5);
        newBrackets = newBrackets.map(match => {
            if (!match.jugadorUno.id || !match.jugadorDos.id) {
                match.ganador = null;
                match.jugadorUno.score = 0;
                match.jugadorDos.score = 0;
                console.log(`El match ${match.id} no tiene jugador 1 ni 2`);
            }

            console.log(match.id, brackets[brackets.length - 1].id, Math.trunc(result));
            if (/* match.id != brackets[brackets.length - 1].id */Math.trunc(result) % 15 != 0 && match.id == tempPartidas[Math.trunc(result)].id) {
                if (result % 1 == 0) {
                    match.jugadorUno.id = winner;
                } else {
                    match.jugadorDos.id = winner;
                }
            }
            return match;
        })
        // function deducirMatch(num) {
        //     console.log("Partida con id "+tempPartidas[Math.trunc(result)].id);
            
        //     // if () {
                
        //     // }

        // }

        // deducirMatch(partida);
        

        // console.log(newBrackets);
        let data = {
            partidas: newBrackets,
            jugadores: playerList
        }

        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        mostrarContenido(window.location.pathname);

        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);

        // console.log(clave, valor, partida);
        await fetch('/api/update-match-info',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: JSON.stringify(data)})
        })
    }

    function cargarCategoria(numero) {
        tempJugadores = playerList.slice((numero - 1) * 16, ((numero - 1) * 16) + 16);
        sessionStorage.setItem("jugadores", JSON.stringify(tempJugadores));
        // console.log(tempJugadores);

        tempPartidas = brackets.slice((numero - 1) * 15, ((numero - 1) * 15) + 15);
        sessionStorage.setItem("partidas", JSON.stringify(tempPartidas));
        // console.log(tempPartidas);

        mostrarContenido(window.location.pathname);
        // loadLeftBar(tempJugadores);
    }

    categorySelector.addEventListener("change",() => {
        cargarCategoria(categorySelector.value);
    })
    cargarCategoria(categorySelector.value);

    // console.log("Fgh");
    let data = await fetch("/api/show-data");
    data = await data.json();
    // data = data.json();
    // console.log(data);
    
  
  // Función para cambiar de ruta
  function cambiarRuta(ruta) {
    history.pushState({}, "", ruta);
    mostrarContenido(ruta);
  }
  
  // Función para mostrar el contenido correspondiente a la ruta
  async function mostrarContenido(ruta) {
    

    let logo1 = document.querySelector("#logo1");
    logo1.style.opacity = 1;

    let logo2 = document.querySelector("#logo2");
    logo2.style.opacity = 1;
    
    let mainLogo = document.querySelector("#main-logo");
    mainLogo.style.opacity = 1;

    let contenido = ``;
    switch (ruta) {
        case "/":
            contenido = `<img width="100%" src="/img/promo-pag.png" alt="" />`
            logo1.style.opacity = 0;
            logo2.style.opacity = 0;
            mainLogo.style.opacity = 0;
            document.getElementById("main-cont").innerHTML = contenido;
            break;
        case "/sorteo":
            // console.log(tempPartidas);
            // console.log(buscarPartida(1).id);
            contenido = `
            <div id="left-bar" class="table-cont">
                <h3 id="seed-table-header">Clasificacion</h3>
                    <table id="seed-table" class="table table-striped"></table>
                </div>
                <div id="main">
                    <div id="left-brackets">
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 1).id}" id="first-match" class="match">
                            <span id="slot-1">${buscarPartida(((categorySelector.value - 1) * 15) + 1).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 1).jugadorUno.id).nick : 1}</span>
                            <span id="slot-9">${buscarPartida(((categorySelector.value - 1) * 15) + 1).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 1).jugadorDos.id).nick : 9}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 2).id}" id="second-match" class="match">
                            <span id="slot-5">${buscarPartida(((categorySelector.value - 1) * 15) + 2).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 2).jugadorUno.id).nick : 5}</span>
                            <span id="slot-13">${buscarPartida(((categorySelector.value - 1) * 15) + 2).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 2).jugadorDos.id).nick : 13}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 3).id}" id="third-match" class="match">
                            <span id="slot-3">${buscarPartida(((categorySelector.value - 1) * 15) + 3).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 3).jugadorUno.id).nick : 3}</span>
                            <span id="slot-11">${buscarPartida(((categorySelector.value - 1) * 15) + 3).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 3).jugadorDos.id).nick : 11}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 4).id}" id="fourth-match" class="match">
                            <span id="slot-7">${buscarPartida(((categorySelector.value - 1) * 15) + 4).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 4).jugadorUno.id).nick : 7}</span>
                            <span id="slot-15">${buscarPartida(((categorySelector.value - 1) * 15) + 4).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 4).jugadorDos.id).nick : 15}</span>
                        </div>
                    </div>
                    <img src="/img/bracket-blanca-2.png" />
                    <div id="right-brackets">
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 5).id}" id="fifth-match" class="match">
                            <span id="slot-2">${buscarPartida(((categorySelector.value - 1) * 15) + 5).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 5).jugadorUno.id).nick : 2}</span>
                            <span id="slot-10">${buscarPartida(((categorySelector.value - 1) * 15) + 5).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 5).jugadorDos.id).nick : 10}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 6).id}" id="sixth-match" class="match">
                            <span id="slot-6">${buscarPartida(((categorySelector.value - 1) * 15) + 6).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 6).jugadorUno.id).nick : 6}</span>
                            <span id="slot-14">${buscarPartida(((categorySelector.value - 1) * 15) + 6).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 6).jugadorDos.id).nick : 14}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 7).id}" id="seventh-match" class="match">
                            <span id="slot-4">${buscarPartida(((categorySelector.value - 1) * 15) + 7).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 7).jugadorUno.id).nick : 4}</span>
                            <span id="slot-12">${buscarPartida(((categorySelector.value - 1) * 15) + 7).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 7).jugadorDos.id).nick : 12}</span>
                        </div>
                        <div data-match="${buscarPartida(((categorySelector.value - 1) * 15) + 8).id}" id="eight-match" class="match">
                            <span id="slot-8">${buscarPartida(((categorySelector.value - 1) * 15) + 8).jugadorUno.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 8).jugadorUno.id).nick : 8}</span>
                            <span id="slot-16">${buscarPartida(((categorySelector.value - 1) * 15) + 8).jugadorDos.id ? buscarJugador(buscarPartida(((categorySelector.value - 1) * 15) + 8).jugadorDos.id).nick : 16}</span>
                        </div>
                    </div>
                </div>
                <div id="inv"></div>
            `;
            document.getElementById("main-cont").innerHTML = contenido;

            let matches = document.querySelectorAll(".match > span");
            matches.forEach(match => {
                match.addEventListener("dblclick", (e) => {
                        if (verifyAdmin()) {
                        // console.log(`Click en el slot ${e.target.id.replace("slot-","")}`);
                        let div = document.createElement("div");
                        div.classList.add("popup-background");
                        div.addEventListener("click", (event) => {
                            if (event.target === div) {
                                div.remove();
                            }
                        })
    
                        let span = document.createElement("span");
                        span.classList.add("popup-overlay");
                        div.appendChild(span);
    
                        let p1 = document.createElement("p");
                        p1.innerText = `Que jugador ocupará el slot ${e.target.id.replace("slot-","")}`;
                        span.appendChild(p1);
    
                        let p2 = document.createElement("p");
                        let partida = buscarPartida(e.target.parentNode.getAttribute("data-match"))
                        // console.log(partida);
                        let rival = e.target.id.replace("slot-","") <= 8 ? partida.jugadorDos.id : partida.jugadorUno.id;
                        // console.log(rival);
                        
                        p2.innerText = `(Actualmente ${rival ? "rival de "+buscarJugador(rival).nick : "sin rival"})`;
                        span.appendChild(p2);
    
                        let input = document.createElement("input");
                        span.appendChild(input);
    
                        let ul = document.createElement("ul");
    
                        input.addEventListener("input", ()=>{
                            // console.log();
                            ul.innerHTML = "";
                            tempJugadores.forEach(jugador => {
                                if (jugador.nick.toLowerCase().trim().replaceAll(" ", "").includes(input.value.toLowerCase().trim().replaceAll(" ", ""))) {
                                    let li = document.createElement("li");
                                    li.innerHTML = `<p>${jugador.nick}</p>`;
            
                                    // <i class="fas fa-share"></i>
                                    let submitButton = document.createElement("i");
                                    submitButton.classList.add("fas");
                                    submitButton.classList.add("fa-share");
    
                                    
                                    submitButton.addEventListener("click", () =>{
                                        asignarJugador(jugador.id, e.target.id.replace("slot-","") >= 8 ? "dos" : "uno", partida.id)
                                        div.remove();
                                    })
                                    li.appendChild(submitButton);
    
                                    ul.appendChild(li);
                                }
                            })
                        })
    
                        span.appendChild(ul);
    
                        tempJugadores.forEach(jugador => {
                            let li = document.createElement("li");
                            li.innerHTML = `<p>${jugador.nick}</p>`;
    
                            // <i class="fas fa-share"></i>
                            let submitButton = document.createElement("i");
                            submitButton.classList.add("fas");
                            submitButton.classList.add("fa-share");
    
                            
                            submitButton.addEventListener("click", () =>{
                                asignarJugador(jugador.id, e.target.id.replace("slot-","") > 8 ? "dos" : "uno", partida.id)
                                div.remove();
                            });
                            li.appendChild(submitButton);
    
                            ul.appendChild(li);
                        })
    
                        document.body.appendChild(div);
                    }
                    })
            })

            loadLeftBar(tempJugadores);

            if (verifyAdmin()) {
                let loadPlayers = document.querySelector("#seed-table-header");
                loadPlayers.addEventListener("dblclick", () => {
                    let loadPlayersDiv = document.createElement("div");
                    loadPlayersDiv.classList.add("load-players")

                    let loadPlayersSpan = document.createElement("span");
                    loadPlayersDiv.appendChild(loadPlayersSpan);

                    let loadPlayersTitle = document.createElement("h4");
                    loadPlayersTitle.innerHTML = "¿Deseas sobreescribir los jugadores actuales?"
                    loadPlayersSpan.appendChild(loadPlayersTitle);

                    let loadPlayersCancel = document.createElement("button");
                    loadPlayersCancel.classList.add("cancel-button");
                    loadPlayersCancel.innerHTML = "Cancelar";
                    loadPlayersCancel.addEventListener("click",()=>{
                        loadPlayersSpan.remove();
                    })
                    loadPlayersSpan.appendChild(loadPlayersCancel);

                    let loadPlayersInput = document.createElement("input");
                    loadPlayersSpan.appendChild(loadPlayersInput);

                    let loadPlayersAccept = document.createElement("button");
                    loadPlayersAccept.classList.add("accept-button");
                    loadPlayersAccept.innerHTML = "Aceptar";
                    loadPlayersAccept.addEventListener("click",()=>{
                        let newList = loadPlayersInput.value.split(`/`);
                        newList = newList.map((actual,i) => {
                            actual = actual.trim().split("\t");
                            return {
                                "id": i+1,
                                "nick": actual[0],
                                "elo": actual[3],
                                "semilla": i+1,
                                "categoria": i < 16 ? 1 : i < 32 ? 2 : i < 48 ? 3 : 4
                            }
                        })
                        actualizarListaJugadores(newList);
                        // console.log(newList);
                    })
                    loadPlayersSpan.appendChild(loadPlayersAccept);

                    document.getElementById("main-cont").appendChild(loadPlayersDiv);

                })
                
            }
            break;
        case "/brackets":
            contenido = `
                <div id="brackets">
                    <img src="/img/brackets.png"> 
                    <div id="player-list">
                    </div>
                </div>
            `;
            document.getElementById("main-cont").innerHTML = contenido;

            loadBrackets(tempPartidas);
            break;
        case "/handbook":
            contenido = `
                <div id="div-handbook">
                    <iframe id="handbook" src="/pdf/Argenleague_3_Handbook.pdf">
                </div>
            `;
            document.getElementById("main-cont").innerHTML = contenido;
            break;
        default:
            cambiarRuta("/");
            break;
    }
    // cargarCategoria(categorySelector.value);
    // document.getElementById("main-cont").innerHTML = ``;
    // document.getElementById("main-cont").innerHTML = contenido;
  }
  
  // Capturar eventos de clic en enlaces
  const enlaces = document.querySelectorAll("a:not(.main-links)");
  enlaces.forEach(enlace => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      const ruta = enlace.getAttribute("href");
      cambiarRuta(ruta);
    });
  });
  
    socket.on("new-content", (data) => {
        // console.log(data);
        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        playerList = data.jugadores;

        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        brackets = data.partidas;

        cargarCategoria(categorySelector.value);
        // mostrarContenido(window.location.pathname);
    })

    mostrarContenido(window.location.pathname);
    

    
    async function loadLeftBar(players) {
        // console.log(players);
        let leftTable = document.querySelector("#seed-table");
        // console.log(document.querySelector("table"));
        leftTable.innerHTML = `
        <thead class="thead-dark">
            <tr>
                <th id="hide" scope="col">Seed</th>
                <th scope="col" class="df-fdc"><div>Jugador</div></th>
                <th scope="col">Elo</th>
            </tr>
        </thead>
        `;
    
        // let hide = document.getElementById("hide");
        // hide.addEventListener("dblclick", () => toggleAdminLogin())
        let body = document.createElement("tbody");
        // console.log(players);
        let inv = document.getElementById("inv");
        let acc = [];
        // console.log(players);
        players.forEach((player, i) => {
            // console.log(player);
            acc.push(player.semilla);
            let tr = document.createElement("tr");
            tr.classList.add("seed"+player.semilla);
            tr.classList.add("player");
            tr.classList.add("asd");
    
            let seed = document.createElement("th");
            seed.setAttribute("scope", "row")
            seed.innerHTML = player.semilla;
            tr.appendChild(seed);
    
            let td = document.createElement("td");
            td.innerHTML = `
                <div class="bold">${player.nick}</div>
            `;
            td.addEventListener("dblclick", () => {
                    if (verifyAdmin()) {
                    td.innerHTML = `
                        <div id="update-div">
                            <input type="hidden" id="update-id" name="nick" value="${player.id}"/>
                            <i class="fas fa-times-circle"></i>
                            <input type="text" id="update-nick" name="nick" autocomplete="off" value="${player.nick}"/>
                            <i class="fas fa-check-square"></i>
                        </div>
                    `
                    
                    td.querySelector("i.fa-check-square").addEventListener("click", async function(){
                        await actualizarNick(player.id,td.querySelector("#update-nick").value);
                        td.innerHTML = td.querySelector("#update-nick").value;
                    })
    
                    td.querySelector("i.fa-times-circle").addEventListener("click", async function(){
                        td.innerHTML = player.nick;
                    })
                }
                })
            tr.appendChild(td);
    
            let eloTd = document.createElement("td");
            eloTd.innerHTML = player.elo || 2000-player.id;
            tr.appendChild(eloTd);
    
            body.appendChild(tr);
        })
        inv.textContent = acc.toString();
        leftTable.appendChild(body);
    }

    async function loadBrackets(matches) {
        let list = document.querySelector("#player-list");

        let octLeft = document.createElement("div");
        octLeft.classList.add("oct-left");
        list.appendChild(octLeft);

        let quarterLeft = document.createElement("div");
        quarterLeft.classList.add("quarter-left");
        list.appendChild(quarterLeft);

        let semiLeft = document.createElement("div");
        semiLeft.classList.add("semi-left");
        list.appendChild(semiLeft);

        let final = document.createElement("div");
        final.classList.add("final");
        list.appendChild(final);

        let semiRight = document.createElement("div");
        semiRight.classList.add("semi-right");
        list.appendChild(semiRight);

        let quarterRight = document.createElement("div");
        quarterRight.classList.add("quarter-right");
        list.appendChild(quarterRight);

        let octRight = document.createElement("div");
        octRight.classList.add("oct-right");
        list.appendChild(octRight);

        matches.forEach((match,i) => {
            let matchDiv = document.createElement("div");
            matchDiv.classList.add("bracket-match");
            matchDiv.classList.add("match-"+i);

            // matchDiv.getAttribute

            // console.log(match);
            let span1 = document.createElement("span");
            span1.classList.add("bracket-player");
            span1.innerHTML = buscarJugador(match.jugadorUno.id) ? buscarJugador(match.jugadorUno.id).nick : "A definir";

            let span1Result = document.createElement("span");
            span1Result.innerHTML = match.ganador ? match.jugadorUno.score : "-";
            span1Result.classList.add("match-score");
            span1.appendChild(span1Result);

            matchDiv.appendChild(span1);

            let span2 = document.createElement("span");
            span2.classList.add("bracket-player");
            span2.innerHTML = buscarJugador(match.jugadorDos.id) ? buscarJugador(match.jugadorDos.id).nick : "A definir";

            let span2Result = document.createElement("span");
            span2Result.innerHTML = match.ganador ? match.jugadorDos.score : "-";
            span2Result.classList.add("match-score");
            span2.appendChild(span2Result);

            matchDiv.appendChild(span2);

            if (i < 8) {
                matchDiv.style.height = "16vh";
            } else if (i < 12){
                matchDiv.style.height = "25vh";
            } else if (i < 14){
                matchDiv.style.height = "45vh";
            }

            switch (i) {
                case 0:
                case 1:
                case 2:
                case 3:
                    span1.classList.add("left-match");
                    span2.classList.add("left-match");
                    octLeft.appendChild(matchDiv);
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                    span1.classList.add("right-match");
                    span2.classList.add("right-match");
                    octRight.appendChild(matchDiv);
                    break;
                case 8:
                case 9:
                    span1.classList.add("left-match");
                    span2.classList.add("left-match");
                    quarterLeft.appendChild(matchDiv);
                    break;
                case 10:
                case 11:
                    span1.classList.add("right-match");
                    span2.classList.add("right-match");
                    quarterRight.appendChild(matchDiv);
                    break;
                case 12:
                    span1.classList.add("left-match");
                    span2.classList.add("left-match");
                    semiLeft.appendChild(matchDiv);
                    break;
                case 13:
                    span1.classList.add("right-match");
                    span2.classList.add("right-match");
                    semiRight.appendChild(matchDiv);
                    break;
                default:
                    span1.classList.add("left-match");
                    span2.classList.add("right-match");
                    final.appendChild(matchDiv);
                    break;
            }

            let data = document.createElement("ul");
            let etapa;
            switch (match.etapa) {
                case 1:
                    etapa = "Octavos de final";
                    break;
                case 2:
                    etapa = "Cuartos de final";
                    break;
                case 3:
                    etapa = "Semifinal";
                    break;
                case 4:
                    etapa = "Final";
                    break;
                default:
                    break;
            }

            // console.log(etapa);

            // data.innerHTML = `
            //     <li class="title">${etapa}</li>
            //     <li>${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit edit-civdraft-"+match.id+"'></i>" : ""} </li>
            //     <li>${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit edit-mapdraft-"+match.id+"'></i>" : ""} <a href=${"match.caracteristicas}>."map_draftMp_draft+"</a>" || "No hay"}</li>
            //     <li>${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit edit-schedule-"+match.id+"'></i>" : ""} ${scheduleString}</li>
            //     <li class="edit-result-${match.id}">Editar resultado</li>
            // `;

            let firstLi = document.createElement('li');
            firstLi.classList.add("title");
            firstLi.innerHTML += etapa;
            data.appendChild(firstLi);
            
            let civLi = document.createElement('li');
            if (verifyAdmin()) {
                civLi.addEventListener('dblclick', function() {
                    // console.log("Click en eso");
                    console.log("Click");
                    civLi.innerHTML = "";
    
                    let xButton = document.createElement('i');
                    xButton.classList.add("fa-solid");
                    xButton.classList.add("fa-times-circle");
                    xButton.addEventListener('click', ()=>{
                        civLi.innerHTML = match.caracteristicas.civ_draft ?"<a target='_blank' href="+match.caracteristicas.civ_draft+">Civ draft</a>" : "No hay draft de civs";
                    });
                    civLi.appendChild(xButton);
                    
                    let civInput = document.createElement('input');
                    civLi.appendChild(civInput);
    
                    let checkButton = document.createElement('i');
                    checkButton.classList.add("fa-solid");
                    checkButton.classList.add("fa-check-square");
                    checkButton.addEventListener('click', ()=>{
                        if (civInput.value.includes("https://aoe2cm.net/")) {
                            actualizarInfoPartida('civ_draft', civInput.value, match.id);
                        } else {
                            actualizarInfoPartida('civ_draft', '', match.id);
                        }
                    });
                    civLi.appendChild(checkButton);
                })
            }
            civLi.innerHTML += match.caracteristicas.civ_draft ?"<a target='_blank' href="+match.caracteristicas.civ_draft+">Civ draft</a>" : "No hay draft de civs";
            data.appendChild(civLi);

            let mapLi = document.createElement('li');
            if (verifyAdmin()) {
                mapLi.addEventListener('dblclick', function() {
                    // console.log("Click en eso");
                    console.log("Click");
                    mapLi.innerHTML = "";
    
                    let xButton = document.createElement('i');
                    xButton.classList.add("fa-solid");
                    xButton.classList.add("fa-times-circle");
                    xButton.addEventListener('click', ()=>{
                        mapLi.innerHTML = match.caracteristicas.map_draft ?"<a target='_blank' href="+match.caracteristicas.map_draft+">Map draft</a>" : "No hay draft de mapas";
                    })
                    mapLi.appendChild(xButton);
                    
                    let mapInput = document.createElement('input');
                    mapLi.appendChild(mapInput);
    
                    let checkButton = document.createElement('i');
                    checkButton.classList.add("fa-solid");
                    checkButton.classList.add("fa-check-square");
                    checkButton.addEventListener('click', ()=>{
                        if (mapInput.value.includes("https://aoe2cm.net/")) {
                            actualizarInfoPartida('map_draft', mapInput.value, match.id);
                        } else {
                            actualizarInfoPartida('map_draft', '', match.id);
                        }
                    });
                    mapLi.appendChild(checkButton);
                })
            }
            mapLi.innerHTML += match.caracteristicas.map_draft ?"<a target='_blank' href="+match.caracteristicas.map_draft+">Map draft</a>" : "No hay draft de mapas";
            data.appendChild(mapLi);

            let scheduleLi = document.createElement('li');
            let scheduleTime
            let scheduleString = "-"

            function obtenerFechaHoraActual() {
                return new Date();
              }
              
              function calcularTiempoTranscurrido(fechaHoraObjetivo) {
                const fechaHoraActual = obtenerFechaHoraActual();
                const diferenciaMilisegundos = fechaHoraObjetivo.getTime() - fechaHoraActual.getTime();
                const segundos = diferenciaMilisegundos / 1000;
                const minutos = segundos / 60;
                const horas = Math.floor(minutos / 60);
                const minutosRestantes = minutos % 60;
              
                if (fechaHoraObjetivo < fechaHoraActual) {
                  return {
                    transcurrido: {
                      horas,
                      minutos: minutosRestantes
                    }
                  };
                } else {
                  return {
                    restante: {
                      horas,
                      minutos: minutosRestantes
                    }
                  };
                }
              }

            if (match.caracteristicas.horario) {
                scheduleTime = new Date(match.caracteristicas.horario);
                // mes+1 < 10 ? '0'+(mes+1) : mes+1
                console.log(calcularTiempoTranscurrido(scheduleTime));
                let tiempoPara = calcularTiempoTranscurrido(scheduleTime);
                scheduleString = `${scheduleTime.getDate() < 10 ? '0'+(scheduleTime.getDate()) : scheduleTime.getDate()}-${scheduleTime.getMonth()+1 < 10 ? '0'+(scheduleTime.getMonth()+1) : scheduleTime.getMonth()+1} a las ${scheduleTime.getHours()}:${scheduleTime.getMinutes()}${tiempoPara.restante ? " (En "+Math.trunc(tiempoPara.restante.horas)+":"+(Math.trunc(tiempoPara.restante.minutos) < 10 ? "0"+Math.trunc(tiempoPara.restante.minutos) : Math.trunc(tiempoPara.restante.minutos))+"h"+(Math.trunc(tiempoPara.restante.horas) > 1 ? "s" : "")+")" : ""}`
                console.log(scheduleString);
            }
            if (verifyAdmin()) {
                scheduleLi.addEventListener('dblclick', function() {
                    // console.log("Click en eso");
                    console.log("Click");
                    scheduleLi.innerHTML = "";
    
                    let xButton = document.createElement('i');
                    xButton.classList.add("fa-solid");
                    xButton.classList.add("fa-times-circle");
                    xButton.addEventListener('click', ()=>{
                        scheduleLi.innerHTML = `${scheduleString}`;
                    })
                    scheduleLi.appendChild(xButton);
                    
                    let scheduleInput = document.createElement('input');
                    scheduleInput.type = "datetime-local";
                    if (match.caracteristicas.horario) {
                        scheduleInput.value = match.caracteristicas.horario;
                    }
                    scheduleInput.addEventListener("input", ()=>{
                        console.log(scheduleInput.value);
                    })
                    scheduleLi.appendChild(scheduleInput);
    
                    let checkButton = document.createElement('i');
                    checkButton.classList.add("fa-solid");
                    checkButton.classList.add("fa-check-square");
                    checkButton.addEventListener('click', ()=>{
                        actualizarInfoPartida('horario', scheduleInput.value, match.id);
                    });
                    scheduleLi.appendChild(checkButton);
                })
            }
            scheduleLi.innerHTML += `${scheduleString}`;
            data.appendChild(scheduleLi);

            // function resetSchedule(){
                
            // }

            if (verifyAdmin()) {
                let scoreLi = document.createElement('li');
                scoreLi.innerHTML += `Guardar resultado`;

                let actualScore = {
                    jugadorUno: match.jugadorUno.score,
                    jugadorDos: match.jugadorDos.score
                }

                function setScore(player, func) {
                    if (player == 1) {
                        if (func == "add") {
                            actualScore.jugadorUno++;
                        } else if (func == "remove") {
                            actualScore.jugadorUno--;
                        }
                        span1Result.innerHTML = actualScore.jugadorUno;
                    } else if (player == 2) {
                        if (func == "add") {
                            actualScore.jugadorDos++;
                        } else if (func == "remove") {
                            actualScore.jugadorDos--;
                        }
                        span2Result.innerHTML = actualScore.jugadorDos;
                    } else {
                        span1Result.innerHTML = actualScore.jugadorUno;
                        span2Result.innerHTML = actualScore.jugadorDos;
                    }
                }

                let isActive = false;
                scoreLi.addEventListener('click', function() {
                    if (match.jugadorUno.id && match.jugadorDos.id) {
                        if (!isActive) {
                            isActive = true;
                            span1.innerHTML = buscarJugador(match.jugadorUno.id) ? buscarJugador(match.jugadorUno.id).nick : "A definir";
                            span1.appendChild(span1Result);
                            setScore();
                            // console.log("Click en eso");
                            // console.log("Click");
                            // scoreLi.innerHTML = "";
                            console.log({
                                partidas: tempPartidas,
                                jugadores: tempJugadores,
                            });
    
                            let spanScore1 = document.createElement('span');
                            spanScore1.classList.add("modify-score");
                            let spanScore1ArrowUp = document.createElement('i');
                            spanScore1ArrowUp.classList.add("fa-solid");
                            spanScore1ArrowUp.classList.add("fa-sort-up");
                            spanScore1ArrowUp.addEventListener('click', () => {
                                setScore(1, "add");
                            });
                            spanScore1.appendChild(spanScore1ArrowUp);
    
                            let spanScore1ArrowDown = document.createElement('i');
                            spanScore1ArrowDown.classList.add("fa-solid");
                            spanScore1ArrowDown.classList.add("fa-sort-down");
                            spanScore1ArrowDown.addEventListener('click', () => {
                                setScore(1, "remove");
                            });
                            spanScore1.appendChild(spanScore1ArrowDown);
                            span1.appendChild(spanScore1);
    
                            span2.innerHTML = buscarJugador(match.jugadorDos.id) ? buscarJugador(match.jugadorDos.id).nick : "A definir";
                            span2.appendChild(span2Result);
                            setScore();
                            // console.log("Click en eso");
                            // console.log("Click");
                            // scoreLi.innerHTML = "";
                            console.log({
                                partidas: tempPartidas,
                                jugadores: tempJugadores,
                            });
    
                            let spanScore2 = document.createElement('span');
                            spanScore2.classList.add("modify-score");
                            let spanScore2ArrowUp = document.createElement('i');
                            spanScore2ArrowUp.classList.add("fa-solid");
                            spanScore2ArrowUp.classList.add("fa-sort-up");
                            spanScore2ArrowUp.addEventListener('click', () => {
                                setScore(2, "add");
                            });
                            spanScore2.appendChild(spanScore2ArrowUp);
    
                            let spanScore2ArrowDown = document.createElement('i');
                            spanScore2ArrowDown.classList.add("fa-solid");
                            spanScore2ArrowDown.classList.add("fa-sort-down");
                            spanScore2ArrowDown.addEventListener('click', () => {
                                setScore(2, "remove");
                            });
                            spanScore2.appendChild(spanScore2ArrowDown);
                            span2.appendChild(spanScore2);
                        } else {
                            isActive = false;
                            actualizarScorePartida(match.id, actualScore);
                        }
                    }
                    // let xButton = document.createElement('i');
                    // xButton.classList.add("fa-solid");
                    // xButton.classList.add("fa-times-circle");
                    // xButton.addEventListener('click', ()=>{
                    //     scoreLi.innerHTML = `${scheduleString}`;
                    // })
                    // scoreLi.appendChild(xButton);
                    
                    // let scheduleInput = document.createElement('input');
                    // scoreLi.appendChild(scheduleInput);
    
                    // let checkButton = document.createElement('i');
                    // checkButton.classList.add("fa-solid");
                    // checkButton.classList.add("fa-check-square");
                    // checkButton.addEventListener('click', ()=>{
                    //     actualizarInfoPartida('horario', scheduleInput.value, match.id);
                    // });
                    // scoreLi.appendChild(checkButton);
                })

                data.appendChild(scoreLi);
            }

            matchDiv.appendChild(data);

            matchDiv.addEventListener('click', (e) => {
                matchDiv.classList.add("show");
            })

            if (i == matches.length - 1) {
                let bracketDiv = document.querySelector("#brackets");

                let championDiv = document.createElement("div");
                championDiv.classList.add("final-display");

                let championSpan = document.createElement("span");
                championDiv.appendChild(championSpan);
                
                bracketDiv.appendChild(championDiv);

                championSpan.innerHTML = "asd";

                if (match.ganador) {
                    championSpan.innerHTML = buscarJugador(match.ganador).nick;
                    championDiv.classList.add("display-show");
                } else {
                    championDiv.classList.remove("display-show");
                }

            }

            // list.appendChild(matchDiv);
        })
    }
});



