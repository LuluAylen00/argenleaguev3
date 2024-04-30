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
    resetBrackets(e);
    // e.preventDefault();
});

function resetBrackets(e) {
    let matches = document.querySelectorAll(".show");
    matches.forEach((match) => {
        // console.log(e.target != match, !e.target.contains(match));
        // console.log();
        // console.log();
        if (e.target != match && !match.contains(e.target) ) {
            match.classList.remove('show');
        }
    });
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

            data.innerHTML = `
                <li class="title">${etapa}</li>
                <li>Civs draft: ${match.caracteristicas.civ_draft || "No hay"} ${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit'></i>" : ""}</li>
                <li>Maps draft: ${match.caracteristicas.map_draft || "No hay"} ${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit'></i>" : ""}</li>
                <li>${match.caracteristicas.horario || "-"} ${verifyAdmin() ? "<i class='fa-solid fa-pen data-edit'></i>" : ""}</li>
            `;
            
            matchDiv.appendChild(data);

            matchDiv.addEventListener('contextmenu', (e) => {
                

                

                matchDiv.classList.add("show");
            })

            // list.appendChild(matchDiv);
        })
    }
});



