async function loadFinalPhase(data){
    document.getElementById("main-cont").innerHTML = ``;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    // console.log(data.players);
    let main = document.getElementById('main-cont');
    
    main.innerHTML = `
        <div class="brackets">
        </div>
    `
   
    let newRounds = [];

    data.matches.forEach((match,i) => {
        if (match.etapaId != 4) {
            newRounds[match.etapaId-1] = newRounds[match.etapaId-1] ? [...newRounds[match.etapaId-1], {
                player1: {name: `${match.etapaId == 1 ? (i+1)+" | " : ""}${match.jugadorUno ? match.jugadorUno.nick : "TBD"}`, winner: match.ganador == 0 || undefined,ID: match.jugadorUnoId || (i + 25)},
                player2: {name: `${match.etapaId == 1 ? (8-i)+" | " : ""}${match.jugadorDos ? match.jugadorDos.nick : "TBD"}`, winner: match.ganador == 1 || undefined,ID: match.jugadorDosId || (i + 55)},
            }] : [{
                player1: {name: `${match.etapaId == 1 ? (i+1)+" | " : ""}${match.jugadorUno ? match.jugadorUno.nick : "TBD"}`, winner: match.ganador == 0 || undefined,ID: match.jugadorUnoId || (i + 25)},
                player2: {name: `${match.etapaId == 1 ? (8-i)+" | " : ""}${match.jugadorDos ? match.jugadorDos.nick : "TBD"}`, winner: match.ganador == 1 || undefined,ID: match.jugadorDosId || (i + 55)},
            }]
        } else if (match.etapaId == 4) {
            let player = { name: "TBD", winner: true, ID: 250 }
            if (data.matches[7].jugadorUno) {
                // let players = [data.matches[7].jugadorUno, data.matches[7].jugadorDos]
                player.name = data.matches[7].jugadorUno.nick
                player.ID = data.matches[7].jugadorUno.id
            }
            newRounds[match.etapaId-1] = [{
                player1: player,
                }]
        }
    })
    // console.log(newRounds);

    var titles = ['Cuartos de final', 'Semifinal', 'Final', 'Ganador'];
    console.log("newRounds", newRounds);
    $(".brackets").brackets({
        titles: titles,
        rounds: newRounds,
        color_title: '#1ed5ff',
        border_color: '#1ed5ff',
        // color_player: '#bb9f59', // solid 1px rgb(75 75 75 / 30%)
        // bg_player: 'white',
        color_player_hover: 'white',
        bg_player_hover: '#13304c',
        border_radius_player: '4px',
        border_radius_lines: '8px',
      });
    //   console.log(data.matches);
    if(verifyAdmin()){
        let div = document.createElement('div');
        div.setAttribute("id", "final-user-div");
        let a = document.createElement("a");
        a.classList.add("btn");
        a.classList.add("btn-primary");
        a.setAttribute("href","#");
        a.setAttribute("role","button");
        a.innerHTML = `<i class="fas fa-user"></i>`
        a.addEventListener("click", ()=>{
            let validate = document.getElementById("usersDiv");
            if (!validate) {
                let usersDiv = document.createElement('div');
                validate = usersDiv;
                usersDiv.setAttribute("id", "usersDiv");
                // let div = document.createElement("div");
                // usersDiv.classList.add("group-cont");
                usersDiv.classList.add("table-cont");

                let groupTable = document.createElement('table');
                groupTable.classList.add("table");
                groupTable.classList.add("table-sm")
                groupTable.classList.add("table-stripped");
    
                let thead = document.createElement('thead');
                thead.classList.add("thead-dark")
                thead.innerHTML = `<tr><th scope="col">Clasificado</th><th scope="col">Grupo</th><th scope="col">Accion</th></tr>`
                groupTable.appendChild(thead);
    
                let tbody = document.createElement('tbody');
                // console.log(group);
                data.players.sort((p1, p2) => {
                    // Primero comparamos por posición
                    if (p1.scope === p2.scope) {
                      return p1.grupoId - p2.grupoId;
                    } else if (p1.scope === "1°") {
                      return -1;
                    } else {
                      return 1;
                    }
                  })

                data.players.forEach((p,i) => {
                    // console.log(p);
                    let tr = document.createElement('tr');
                    tr.classList.add("seed"+p.semilla);
                    tr.classList.add("player");
                    tr.classList.add("asd");
                    // console.log(groupPhase);
                    // console.log("points for"+p.nick,calcPoints(p.nick,groupFromPhase));
                    let td = document.createElement("td");
                    td.innerHTML = p.nick;
                    tr.appendChild(td);
    
                    let groupTh = document.createElement("th");
                    groupTh.setAttribute("scope", "row")
                    groupTh.innerHTML = `G${p.grupoId} (${p.scope})`;
                    tr.appendChild(groupTh);
    
                    let action = document.createElement("th");
                    action.setAttribute("scope", "row")
                    let aA = document.createElement("a");
                    aA.classList.add("btn");
                    aA.classList.add("btn-success");
                    aA.setAttribute("href","#");
                    aA.setAttribute("role","button");
                    aA.innerHTML = `<i class="fas fa-pen"></i>`
                    aA.addEventListener("click", ()=>{
                        Swal.fire({
                            title: `Que slot ocupara ${p.nick}?`,
                            input: 'text',
                            allowOutsideClick: false,
                            inputAttributes: {
                              autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            cancelButtonText: "Cancelar",
                            confirmButtonText: 'Aceptar',
                            showLoaderOnConfirm: true,
                            preConfirm: async (info) => {
                                console.log(info);
                                let fetching = await fetch(`/api/final/set/player`,{
                                    method: 'PATCH',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        playerType: info < 5 ? "jugadorUnoId" : "jugadorDosId",
                                        playerId: p.id,
                                        matchId: deduce(info, t)
                                    })
                                })
                                fetching = await fetching.json();
                                // if (deduce(info)) {
            
                                    if (fetching.status == 200) {
                                        // Swal.fire({
                                        //     title: `${p.nick} ahora es parte del grupo ${info}`,
                                        //     confirmButtonText: 'Ok',
                                        // })
                                        await loadFinalPage();
                                    } else {
                                        Swal.fire({
                                            title: `Se ha producido un error al insertar al jugador en ${info}`,
                                            confirmButtonText: 'Ok'
                                        })
                                    }
                                // } else {
                                //     Swal.fire({
                                //         title: `El slot ${info} no existe`,
                                //         confirmButtonText: 'Ok'
                                //     })
                                // }
                            },
                        })
                    })
    
                    action.appendChild(aA);
                    tr.appendChild(action);
    
                    tbody.appendChild(tr);
                })
                sortTable(tbody)
                groupTable.appendChild(tbody);
    
                usersDiv.appendChild(groupTable);
                div.appendChild(usersDiv)
            } else {
                div.removeChild(div.children[1]);
                // div.innerHTML
            }
        })
        div.appendChild(a);
        main.appendChild(div);


        // let roundTwoMatches = document.querySelectorAll(".rd-2 .player");
        // console.log(roundTwoMatches);

        // let roundThreeMatches = document.querySelectorAll(".rd-3 .player");
        // console.log(roundThreeMatches);

        // let roundFourMatches = document.querySelectorAll(".rd-4 .player");
        // console.log(roundFourMatches);

        let matchList = document.querySelectorAll(".match")
        console.log(matchList);

        for (let i=0;i<matchList.length;i++) {
            let roundName = i < 4 ? "este match por Cuartos" : i < 6 ? "este match por Semis" : "La gran final"
            matchList[i].addEventListener("dblclick", function () {
                let m = matchList[i];
                let match = data.matches[i];
                console.log(match);
                if (match.jugadorUno && match.jugadorDos) {
                    if (i != matchList.length - 1) {
                        Swal.fire({
                            title: `Quien gano ${roundName}?`,
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonColor: '#3f47cc',
                            denyButtonColor: '#ed1b24',
                            confirmButtonText: match.jugadorUno.nick,
                            denyButtonText: match.jugadorDos.nick,
                            cancelButtonText: `Limpiar`,
                            focusCancel: true
                        }).then(async(result) => {
                            if (result.isConfirmed) {
                                let fetching = await fetch(`/api/final-phase-winner/${t}`,{
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        match: match.id,
                                        winner: match.jugadorUno.id
                                    })
                                })
                                fetching = await fetching.json();
                                // console.log(fetching);
                                if (fetching.status == 200) {
                                    // Swal.fire(`${match.jugadorUno.nick} ha ganado!`, '', 'success')
                                    await setPage();
                                }
                            } else if (result.isDenied) {
                                let fetching = await fetch(`/api/final-phase-winner/${t}`,{
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        match: match.id,
                                        winner: match.jugadorDos.id
                                    })
                                })
                                fetching = await fetching.json();
                
                                if (fetching.status == 200) {
                                    // Swal.fire(`${match.jugadorDos.nick} ha ganado!`, '', 'success')
                                    await setPage();
                                }
                            }  else if (result.isDismissed && result.dismiss == "cancel") {
                                let fetching = await fetch(`/api/final-phase-winner/${t}`,{
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        match: match.id,
                                        winner: null 
                                    })
                                })
                                fetching = await fetching.json();
                
                                if (fetching.status == 200) {
                                    // Swal.fire(`Se ha reiniciado la partida`, '', 'info')
                                    await setPage();
                                }
                            }
                        });
                    }
                }
            })
        
        }

        // roundTwoMatches.addEventListener("dblclick", ()=>{

        // })
    }
}

async function loadFinalPage() {
    document.getElementById("main-cont").innerHTML = ``;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    tierSelector.value = t;
    let playerList = await fetch(`/api/players/${t}`);
    playerList = await playerList.json();

    let groupPhase = await fetch("/api/group-phase/"+t);
    groupPhase = await groupPhase.json();
    let groupFromPhase = getMatches(groupPhase)

    let groups = await fetch("/api/groups/"+t);
    groups = await groups.json();

    let list = [groups["1"],groups["2"],groups["3"],groups["4"]]
    let acc = [];
    list.forEach(function(group, i){
        let g = Object.keys(groups)[i];
        if (g && g != "null") {
            group.forEach((p,i) => {

                let wlScore = calcPoints(p.nick,groupFromPhase);    
                if (wlScore[0] == 2 && wlScore[1] == 0) {
                    acc.push({...p, scope: "1°"})
                } else if (wlScore[0] == 2 && wlScore[1] == 1) {
                    acc.push({...p, scope: "2°"})
                }
            })
        }
    })

    let finalInfo = await fetch(`/api/final/${t}`);
    finalInfo = await finalInfo.json();
    finalInfo = finalInfo.map(match => {
        return {
            ...match,
            jugadorUno: match.jugadorUnoId ? acc.find(p => p.id == match.jugadorUnoId) : undefined,
            jugadorDos: match.jugadorDosId ? acc.find(p => p.id == match.jugadorDosId) : undefined,
        }
    })
    // console.log(acc);
    let dataa = {
        players: acc,
        matches: finalInfo
    }
    console.log(dataa);
    // console.log(playerList);
    await loadFinalPhase(dataa);
    // loadLeftBar(playerList);
    // loadSeedingGroups(playerList,t);
}

function addFinalStyles() {
    // document.getElementById("seeding-groups-h3").style.margin = "2px 15px";

    // let elements = [];
    // let seeds = document.getElementById("inv").textContent.split(",");

    // seeds.forEach((seed)=> {
    //     let el = document.getElementsByClassName("seed"+seed);
    //     elements.push(el);
    // })

    // elements.forEach((elements,i) => {
    //     // console.log(Object.values(elements));
    //     Object.values(elements).forEach((activador) => {
    //         console.log();
    //         let tableInfo = Object.values(activador.classList).includes("table-info") ? true : false
            
    //         activador.addEventListener('mouseover', () => {
    //             // Agrega una clase a los elementos que se modificarán
    //             Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
    //                 elemento.classList.add('selected-player');
    //                 if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
    //                     elemento.classList.remove("table-info")
    //                 }
    //             });
    //         })

    //         activador.addEventListener('mouseout', () => {
    //             // Agrega una clase a los elementos que se modificarán
    //             Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
    //                 elemento.classList.remove('selected-player');
    //                 if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
    //                     elemento.classList.add("table-info")
    //                 }
    //             });
    //         })
    //     })
    // })
}