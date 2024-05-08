let fechas = [
	[
		{
			fecha: "12/5/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "13/5/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "14/5/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "15/5/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "16/5/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "17/5/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "18/5/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "19/5/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "20/5/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "21/5/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "22/5/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "23/5/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "24/5/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "25/5/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "26/5/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "27/5/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "28/5/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "29/5/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "30/5/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "31/5/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "1/6/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "2/6/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "3/6/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "4/6/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "5/6/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "6/6/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "7/6/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "8/6/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "9/6/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "10/6/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "11/6/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "12/6/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "13/6/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "14/6/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "15/6/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "16/6/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "17/6/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "18/6/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "19/6/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "20/6/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "21/6/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "22/6/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "23/6/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "24/6/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "25/6/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "26/6/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "27/6/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "28/6/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "29/6/2024",
			diaSemana: "Sábado",
		},
	],
	[
		{
			fecha: "30/6/2024",
			diaSemana: "Domingo",
		},
		{
			fecha: "1/7/2024",
			diaSemana: "Lunes",
		},
		{
			fecha: "2/7/2024",
			diaSemana: "Martes",
		},
		{
			fecha: "3/7/2024",
			diaSemana: "Miércoles",
		},
		{
			fecha: "4/7/2024",
			diaSemana: "Jueves",
		},
		{
			fecha: "5/7/2024",
			diaSemana: "Viernes",
		},
		{
			fecha: "6/7/2024",
			diaSemana: "Sábado",
		},
	],
];

function detectarPartidas(partidas) {
	return partidas.filter((match) => {
		return match.caracteristicas.horario;
	});
}

function loadCalendar(partidas, jugadores, pagina = 1) {
	function buscarJugador(id) {
		// let jugadores = JSON.parse(sessionStorage.getItem("jugadores"));
		return jugadores.find((jugador) => jugador.id == id);
	}

	// console.log(partidas);
	let calendarDiv = document.querySelector("#calendar");

	let calendar = document.createElement("div");
	calendar.classList.add("calendar");

	let calendarHeader = document.createElement("div");
	calendarHeader.classList.add("calendar-header");
	calendarHeader.innerHTML = `Calendario (Semana del ${
		fechas[pagina - 1][0].fecha
	} al ${fechas[pagina - 1][6].fecha})`;
	calendar.appendChild(calendarHeader);

	let calendarUl = document.createElement("ul");
	calendar.appendChild(calendarUl);

	calendarDiv.appendChild(calendar);

	let calendarDetail = document.createElement("div");
	calendarDetail.classList.add("calendar-detail");

	let calendarDetailHeader = document.createElement("div");
	calendarDetailHeader.classList.add("calendar-detail-header");
	calendarDetailHeader.innerHTML = "Selecciona una fecha";
	calendarDetail.appendChild(calendarDetailHeader);

	let calendarDetailList = document.createElement("ul");
	calendarDetail.appendChild(calendarDetailList);

	calendarDiv.appendChild(calendarDetail);

	fechas[pagina - 1].forEach((dia) => {
		// console.log("Cargando páginas...");
		let diaLi = document.createElement("li");
		// diaLi.innerHTML = `${dia.diaSemana} ${dia.fecha}`;

		let diaInput = document.createElement("input");
		diaInput.type = "radio";
		diaInput.style.display = "none";
		diaInput.setAttribute("name", "calendar-day");
		diaInput.id = `d-${dia.diaSemana}-f-${dia.fecha}`;

		diaInput.addEventListener("input", (e) => {
			let thisDate = e.target.id.split("-f-")[1].split("/");
			let parsedDate = new Date(`${thisDate[1]}/${thisDate[0]}/${thisDate[2]}`);
			calendarDetailList.innerHTML = "";

			calendarDetailHeader.innerHTML = `Partidas del dia ${
				e.target.id.split("-f-")[1]
			}`;

			let matchesFound = detectarPartidas(partidas);
			// console.log(matchesFound);

			let partidasDeHoy = [];
			matchesFound.forEach((partida) => {
				// console.log("Cargando partidas....");
				let toCompareDate = partida.caracteristicas.horario;
				// if (toCompareDate) {
				toCompareDate = new Date(toCompareDate);
				// console.log(toCompareDate);
				if (parsedDate.getDate() == toCompareDate.getDate()) {
					// console.log("Coincidencia encontrada");
					// console.log(partida);

					// calendarDetail
					partidasDeHoy.push(partida);
				}
			});

			// console.log(partidasDeHoy.length);
			if (partidasDeHoy.length > 0) {
                

				// console.log("Hay partidas hoy");
				calendarDetailList.innerHTML = "";
				// console.log("Hoy se encontraron matches");
				partidasDeHoy.forEach((match) => {
                    // console.log("Cargando partidas....");
                    let toCompareDate = match.caracteristicas.horario;
                    // if (toCompareDate) {
                    toCompareDate = new Date(toCompareDate);

					let matchLi = document.createElement("li");
					// console.log(match);
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
					matchLi.innerHTML += `${match.categoria}° división - ${
						buscarJugador(match.jugadorUno.id)
							? buscarJugador(match.jugadorUno.id).nick
							: "-"
					} vs ${
						buscarJugador(match.jugadorDos.id)
							? buscarJugador(match.jugadorDos.id).nick
							: "-"
					} (${
						toCompareDate.getHours() < 10
							? "0" + toCompareDate.getHours()
							: toCompareDate.getHours()
					}:${
						toCompareDate.getMinutes() < 10
							? "0" + toCompareDate.getMinutes()
							: toCompareDate.getMinutes()
					}hs) - ${etapa}`;
					calendarDetailList.appendChild(matchLi);
				});
			} else {
                // console.log("No hay partidas");
				calendarDetailList.innerHTML = "<li>No hay ningún match este día</li>";
			}
		});

		diaLi.appendChild(diaInput);

		let diaLabel = document.createElement("label");
		diaLabel.innerHTML = `${dia.diaSemana} ${dia.fecha}`;
		diaLabel.setAttribute("for", `d-${dia.diaSemana}-f-${dia.fecha}`);
		diaLi.appendChild(diaLabel);

		calendarUl.appendChild(diaLi);
	});
}
