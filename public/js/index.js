
// let divCont = document.getElementById("cont");

/* function addSeedingStyles() {
    document.getElementById("seeding-groups-h3").style.margin = "2px 15px";

    let elements = [];
    let seeds = document.getElementById("inv").textContent.split(",");

    seeds.forEach((seed)=> {
        let el = document.getElementsByClassName("seed"+seed);
        elements.push(el);
    })

    elements.forEach((elements,i) => {
        // console.log(Object.values(elements));
        Object.values(elements).forEach((activador) => {
            // console.log();
            let tableInfo = Object.values(activador.classList).includes("table-info") ? true : false
            
            activador.addEventListener('mouseover', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.add('selected-player');
                    if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
                        elemento.classList.remove("table-info")
                    }
                });
            })

            activador.addEventListener('mouseout', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.remove('selected-player');
                    if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
                        elemento.classList.add("table-info")
                    }
                });
            })
        })
    })
} */

/* function toggleUpdateNick(id,nick) {
    let form = document.createElement("form");
} */

/* async function loadLeftBar(players) {
    let leftTable = document.getElementById("seed-table");
    leftTable.innerHTML = `
    <thead class="thead-dark">
        <tr>
            <th id="hide" scope="col">Seed</th>
            <th scope="col" class="df-fdc"><div>Jugador</div><div class="bold">(Elo)</div></th>
            <!-- <th scope="col">Elo</th> -->
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
    players.forEach((player) => {
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
            <div>(${player.elo})</div>
        `;
        if (verifyAdmin()) {
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
        }
        tr.appendChild(td);

        // let eloTd = document.createElement("td");
        // eloTd.innerHTML = player.elo;
        // tr.appendChild(eloTd);

        body.appendChild(tr);
    })
    inv.textContent = acc.toString();
    leftTable.appendChild(body);
} */

/* function loadSeedingGroups(players, tier){
    let groups = sliceIntoChunks(players, 4);
    let divCont = document.getElementById("seeding-groups");
    divCont.innerHTML = "";

    groups.forEach(function(group, i){
        let table = document.createElement('table');
        table.classList.add("table");
        table.classList.add("table-stripped");
        table.classList.add("table-sm")

        table.innerHTML = `
        <caption>Tómbola ${i+1} (Seeds ${(i*4)+1}-${(i*4)+4})</caption>
        `
        let tbody = document.createElement('tbody');
        group.forEach((p,i) => {
            let tr = document.createElement('tr');
            tr.classList.add("seed"+p.semilla);
            tr.classList.add("player");
            tr.classList.add("asd");
            tr.classList.add("seeding-tr");
            if (p.grupoId != null) {
                tr.classList.add("table-info")
            } else {
                tr.classList.remove("table-info")
            }

            let seed = document.createElement("th");
            seed.setAttribute("scope", "row")
            seed.innerHTML = p.semilla;
            tr.appendChild(seed);

            let td = document.createElement("td");
            td.innerHTML = p.nick;
            tr.appendChild(td);

            if (verifyAdmin()) {
                let aTd = document.createElement("td");
                let a = document.createElement("a");
                a.classList.add("btn");
                a.classList.add("btn-success");
                a.setAttribute("href","#");
                a.setAttribute("role","button");
                a.innerHTML = `<i class="fas fa-pen"></i>`
                a.addEventListener("click", ()=>{

                    let grupos = [1,2,3,4]
                    let buttonsDiv = document.createElement("div");

                    async function setGroup(info){
                        // console.log(info);
                        // console.log(info);
                        let fetching = await fetch(`/api/groups/`,{
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: p.id,
                                group: info
                            })
                        })
                        fetching = await fetching.json();

                        if (fetching.status == 200) {
                            // Swal.close();
                            // Swal.fire({
                            //     title: `${p.nick} ahora es parte del grupo ${info}`,
                            //     confirmButtonText: 'Ok',
                            // })
                            Swal.close();
                            // await updateGroups(tier)
                            setPage();
                        } else if (fetching.status == 400) {
                            Swal.fire({
                                title: `El valor ingresado (${info}) no parece ser válido`,
                                confirmButtonText: 'Ok'
                            })
                        } else {
                            Swal.fire({
                                title: `El grupo ${info} está lleno, remueve algún integrante para seguir agregando`,
                                confirmButtonText: 'Ok'
                            })
                        }
                    }
                    
                    grupos.forEach(grupo => {
                        //<button type="button" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">Aceptar</button>
                        let buttonA = document.createElement("button");

                        buttonA.setAttribute("type","button");
                        buttonA.setAttribute("class","swal2-styled swal2-modified button-"+grupo);
                        buttonA.setAttribute("aria-label","");
                        buttonA.setAttribute("style","display: inline-block;");
                        buttonA.innerHTML = grupo;

                        buttonsDiv.appendChild(buttonA);
                    })


                    Swal.fire({
                        title: `Introduce el nuevo grupo para ${p.nick}`,
                        // input: 'text',
                        allowOutsideClick: true,
                        // inputAttributes: {
                        //   autocapitalize: 'off'
                        // },
                        // showCancelButton: true,
                        // cancelButtonText: "Cancelar",
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        html: buttonsDiv.outerHTML,
                        didOpen: ()=>{
                            let buttons = document.querySelectorAll(".swal2-modified");
                                // console.log(buttons);
                                buttons.forEach((button,i) => {
                                    button.addEventListener("click", () => {
                                        // console.log("Click en "+button.innerHTML);
                                        setGroup(button.innerHTML);
                                    })
                                })
                        },
                        showConfirmButton: false,
                        // confirmButtonText: 'Aceptar',
                        showLoaderOnConfirm: false,
                        
                    })
                })
                aTd.appendChild(a);
                tr.appendChild(aTd);
            }


            tbody.appendChild(tr);
        })
        table.appendChild(tbody);

        
        divCont.appendChild(table);
    })
} */

/* async function loadGroups(tier){
    // let groups = await fetch("/api/groups/"+tier);
    // groups = await groups.json();

    

    // console.log(groups);
    let divCont = document.getElementById("groups");
    divCont.innerHTML = "";

    Object.values(groups).forEach(function(group, i){
        let g = Object.keys(groups)[i];
        if (g != "null") {
            let div = document.createElement("div");
            div.classList.add("table-cont");
            // let header = document.createElement("h3")
            // header.innerText = `Grupo ${g}`
            // div.appendChild(header);

            let table = document.createElement('table');
            table.classList.add("table");
            table.classList.add("table-stripped");

            let thead = document.createElement('thead');
            thead.innerHTML = `<tr><th scope="col">Grupo ${g}</th></tr>`
            table.appendChild(thead);

            let tbody = document.createElement('tbody');
            group.forEach((p,i) => {
                let tr = document.createElement('tr');
                tr.classList.add("seed"+p.semilla);
                tr.classList.add("player");
                tr.classList.add("asd");

                if (verifyAdmin()) {
                    tr.addEventListener("dblclick", () => {
                        Swal.fire({
                            title: `Quieres remover a ${p.nick} del grupo ${p.grupoId}`,
                            showCancelButton: true,
                            confirmButtonText: 'Confirmar',
                            cancelButtonText: `Volver`,
                          }).then(async (result) => {
                             Read more about isConfirmed, isDenied below 
                             if (result.isConfirmed) {
                                await fetch(`/api/groups/`,{
                                    method: 'DELETE',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        id: p.id
                                    })
                                })
                                // Swal.fire(`${p.nick} ahora está sin grupo`, '', 'success')
                                Swal.close();
                                await updateGroups(tier);
                            } 
                          })
                    })
                }
    
                let td = document.createElement("td");
                td.innerHTML = p.nick;
                tr.appendChild(td);
    
                tbody.appendChild(tr);
            })
            table.appendChild(tbody);
    
            div.appendChild(table)
            divCont.appendChild(div);
        }
    })
} */

// let tierSelector = document.getElementById("tier-selector");

/* async function loadSeedingPage() {
    document.getElementById("main-cont").innerHTML = `
    <div id="left-bar" class="table-cont">
        <h3 id="seed-table-header">Clasificacion</h3>
            <table id="seed-table" class="table table-striped"></table>
        </div>
        <div id="main">
            <div id="groups"></div>
            <div id="cont" class="table-cont">
                <h3 id="seeding-groups-h3">
                    Grupos de sorteo 
                    <i class="fa-solid fa-circle-info"></i>
                    <p class="seeding-info">
                        Los grupos de sorteo son creados dividiendo por 4 los jugadores según su número de seed inicial (basado en su elo), es decir, el primer grupo está conformado por los primeros 4 jugadores clasificados en cada categoría, el segundo por los segundos 4 (5-8) y así. <br />De estos grupos saldrá sorteado un jugador para cada uno de los grupos finales, quedando cada uno en un grupo distinto.
                    </p>
                </h3>
                <div id="seeding-groups" class="table-responsive"></div>
            </div>
        </div>
        <div id="inv"></div>
    `;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    tierSelector.value = t;
    
    let playerList 
    if (!sessionStorage.getItem("playerList")) {
        playerList = await fetch(`/api/players/${t}`)
        playerList = await playerList.json();
    } else {
        playerList = JSON.parse(sessionStorage.getItem("playerList"));
    }

    // console.log(playerList);
    loadLeftBar(playerList);
    loadSeedingGroups(playerList,t);
    await loadGroups(t);
} */

/* async function updateGroups(){
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t");
    tierSelector.value = t;
    let playerList 
    if (!sessionStorage.getItem("playerList")) {
        // playerList = await fetch(`/api/players/${t}`)
        // playerList = await playerList.json();
    } else {
        playerList = JSON.parse(sessionStorage.getItem("playerList"));
    }
    loadLeftBar(playerList);
    loadSeedingGroups(playerList,t);
    await loadGroups(t);
    addSeedingStyles();
} */

/* async function updateNick(id, nick){
    let fetching = await fetch(`/api/players/update`,{
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            nick: nick
        })
    })
    fetching = await fetching.json();
    // console.log(fetching);
    await setPage();
    // if (fetching) {
    //     // Swal.fire(`${match.jugadorUno.nick} ha ganado!`, '', 'success')
    // }
    // await loadGroups(t);
    // loadLeftBar(playerList);
    // loadSeedingGroups(playerList,t);
    // addSeedingStyles();
} */

/* tierSelector.addEventListener("change", (e)=>{
    insertParam('t', e.target.value);
    // updateGroups(e.target.value);
    setPage()
}) */

/* async function setPage() {
    let params = new URLSearchParams(document.location.search);
    let p = params.get("p") || "seeding"
    loading();
    if (p == "seeding") {
        await loadSeedingPage().then(()=>{
            addSeedingStyles();
        })
    } else if (p == "groups") {
        // loading();
        await loadGroupsPage().then(()=>{
            addGroupsStyles();
        })
    } else if (p == "final") {
        // loading();
        await loadFinalPage().then(()=>{
            addFinalStyles();
        })
    } else {
        // loading();
        insertParam('p', "seeding");
        await loadSeedingPage().then(()=>{
            addSeedingStyles();
        })
    }
}
loading();
setPage(); */

// document.getElementById("sort").addEventListener("click", ()=>{
//     insertParam('p', "seeding")
//     setPage();
// })
// document.getElementById("groupPhase").addEventListener("click", ()=>{
//     insertParam('p', "groups")
//     setPage();
// })
// document.getElementById("finalPhase").addEventListener("click", ()=>{
//     insertParam('p', "final")
//     setPage();
// })


