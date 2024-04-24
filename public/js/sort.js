let socket = io();


window.addEventListener("load", async function(){
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
        return partidas.find(partida => partida.id == id) || {jugadorUno: {id: null}, jugadorDos: {id: null}};
    };

    function buscarJugador(id) {
        let jugadores = JSON.parse(sessionStorage.getItem("jugadores"));
        return jugadores.find(jugador => jugador.id == id);
    }

    function asignarJugador(jugador, slot, partida) {
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
        // sessionStorage.setItem("partidas", data.partidas);
        socket.emit("new-content", data);
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
    console.log(data);
    
  
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
            contenido = `<img width="100%" src="/img/promo.png" alt="" />`
            logo1.style.opacity = 0;
            logo2.style.opacity = 0;
            mainLogo.style.opacity = 0;
            document.getElementById("main-cont").innerHTML = contenido;
            break;
        case "/sorteo":
            
            contenido = `
            <div id="left-bar" class="table-cont">
                <h3 id="seed-table-header">Clasificacion</h3>
                    <table id="seed-table" class="table table-striped"></table>
                </div>
                <div id="main">
                    <div id="left-brackets">
                        <div data-match="${buscarPartida(1).id}" id="first-match" class="match">
                            <span id="slot-1">${buscarPartida(1).jugadorUno.id ? buscarJugador(buscarPartida(1).jugadorUno.id).nick : 1}</span>
                            <span id="slot-9">${buscarPartida(1).jugadorDos.id ? buscarJugador(buscarPartida(1).jugadorDos.id).nick : 9}</span>
                        </div>
                        <div data-match="${buscarPartida(2).id}" id="second-match" class="match">
                            <span id="slot-5">${buscarPartida(2).jugadorUno.id ? buscarJugador(buscarPartida(2).jugadorUno.id).nick : 5}</span>
                            <span id="slot-13">${buscarPartida(2).jugadorDos.id ? buscarJugador(buscarPartida(2).jugadorDos.id).nick : 13}</span>
                        </div>
                        <div data-match="${buscarPartida(3).id}" id="third-match" class="match">
                            <span id="slot-3">${buscarPartida(3).jugadorUno.id ? buscarJugador(buscarPartida(3).jugadorUno.id).nick : 3}</span>
                            <span id="slot-11">${buscarPartida(3).jugadorDos.id ? buscarJugador(buscarPartida(3).jugadorDos.id).nick : 11}</span>
                        </div>
                        <div data-match="${buscarPartida(4).id}" id="fourth-match" class="match">
                            <span id="slot-7">${buscarPartida(4).jugadorUno.id ? buscarJugador(buscarPartida(4).jugadorUno.id).nick : 7}</span>
                            <span id="slot-15">${buscarPartida(4).jugadorDos.id ? buscarJugador(buscarPartida(4).jugadorDos.id).nick : 15}</span>
                        </div>
                    </div>
                    <img src="/img/bracket-blanca-2.png" />
                    <div id="right-brackets">
                        <div data-match="${buscarPartida(5).id}" id="fifth-match" class="match">
                            <span id="slot-2">${buscarPartida(5).jugadorUno.id ? buscarJugador(buscarPartida(5).jugadorUno.id).nick : 2}</span>
                            <span id="slot-10">${buscarPartida(5).jugadorDos.id ? buscarJugador(buscarPartida(5).jugadorDos.id).nick : 10}</span>
                        </div>
                        <div data-match="${buscarPartida(6).id}" id="sixth-match" class="match">
                            <span id="slot-6">${buscarPartida(6).jugadorUno.id ? buscarJugador(buscarPartida(6).jugadorUno.id).nick : 6}</span>
                            <span id="slot-14">${buscarPartida(6).jugadorDos.id ? buscarJugador(buscarPartida(6).jugadorDos.id).nick : 14}</span>
                        </div>
                        <div data-match="${buscarPartida(7).id}" id="seventh-match" class="match">
                            <span id="slot-4">${buscarPartida(7).jugadorUno.id ? buscarJugador(buscarPartida(7).jugadorUno.id).nick : 4}</span>
                            <span id="slot-12">${buscarPartida(7).jugadorDos.id ? buscarJugador(buscarPartida(7).jugadorDos.id).nick : 12}</span>
                        </div>
                        <div data-match="${buscarPartida(8).id}" id="eight-match" class="match">
                            <span id="slot-8">${buscarPartida(8).jugadorUno.id ? buscarJugador(buscarPartida(8).jugadorUno.id).nick : 8}</span>
                            <span id="slot-16">${buscarPartida(8).jugadorDos.id ? buscarJugador(buscarPartida(8).jugadorDos.id).nick : 16}</span>
                        </div>
                    </div>
                </div>
                <div id="inv"></div>
            `;
            document.getElementById("main-cont").innerHTML = contenido;

            let matches = document.querySelectorAll(".match > span");
            matches.forEach(match => {
                match.addEventListener("dblclick", (e) => {
                    console.log(`Click en el slot ${e.target.id.replace("slot-","")}`);
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
                            asignarJugador(jugador.id, e.target.id.replace("slot-","") >= 8 ? "dos" : "uno", partida.id)
                            div.remove();
                        })
                        li.appendChild(submitButton);

                        ul.appendChild(li);
                    })

                    document.body.appendChild(div);
                })
            })

            loadLeftBar(tempJugadores);
            break;
        case "/brackets":
            contenido = "<h1>Asd</h1>";
            document.getElementById("main-cont").innerHTML = contenido;
            break;
        case "/handbook":
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
        sessionStorage.setItem("jugadores", JSON.stringify(data.jugadores));
        sessionStorage.setItem("partidas", JSON.stringify(data.partidas));
        
        mostrarContenido(window.location.pathname);
    })

    mostrarContenido(window.location.pathname);
    

});

async function loadLeftBar(players) {
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

    let hide = document.getElementById("hide");
    hide.addEventListener("dblclick", () => toggleAdminLogin())
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
        // if (verifyAdmin()) {
            td.addEventListener("dblclick", () => {
                td.innerHTML = `
                    <div id="update-div">
                        <input type="hidden" id="update-id" name="nick" value="${player.id}"/>
                        <input type="text" id="update-nick" name="nick" autocomplete="off" value="${player.nick}"/>
                        <i class="fas fa-times-circle"></i>
                        <i class="fas fa-check-square"></i>
                    </div>
                `
                
                td.querySelector("i.fa-check-square").addEventListener("click", async function(){
                    await updateNick(player.id,td.querySelector("#update-nick").value);
                    td.innerHTML = td.querySelector("#update-nick").value;
                })

                td.querySelector("i.fa-times-circle").addEventListener("click", async function(){
                    td.innerHTML = player.nick;
                })
            })
        // }
        tr.appendChild(td);

        let eloTd = document.createElement("td");
        eloTd.innerHTML = player.elo || 2000-player.id;
        tr.appendChild(eloTd);

        body.appendChild(tr);
    })
    inv.textContent = acc.toString();
    leftTable.appendChild(body);
}


