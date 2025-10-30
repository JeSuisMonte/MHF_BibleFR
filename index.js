// Ravi Reminder//
document.addEventListener("DOMContentLoaded", function () {
	// Dimanche de référence (à modifier selon ton calendrier)
	const baseDate = new Date('2025-01-05');
	const intervalDays = 14;
	const MS_DAY = 24 * 60 * 60 * 1000;

	const elDays = document.getElementById('reminderDays');
	const elDate = document.getElementById('reminderDate');

	function nextOccurrence(now) {
		const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
		if (now <= base) return base;

		const diffDays = Math.floor((now - base) / MS_DAY);
		const nextIndex = Math.ceil(diffDays / intervalDays);
		return new Date(base.getTime() + nextIndex * intervalDays * MS_DAY);
	}

	function formatDate(d) {
		return d.toLocaleDateString('fr-FR', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function update() {
		const now = new Date();
		const next = nextOccurrence(now);
		const diff = Math.ceil((next - now) / MS_DAY);

		if (diff <= 0) {
			elDays.innerHTML = '<img src="img/quest_start.png" alt="Aujourd\'hui" style="width:120px;height:120px;">';
			elDays.classList.add('today');
		} else {
			elDays.textContent = diff + "J";
			elDays.classList.remove('today');
		}

		elDate.textContent = formatDate(next);
	}

	update();
	setInterval(update, 60000); // mise à jour toutes les minutes
});

//Ex Road Reminder//

document.addEventListener("DOMContentLoaded", function () {
	const cycle = ["Adv", "Adv", "Ex"];
	const MS_DAY = 24 * 60 * 60 * 1000;
	const ROAD_DURATION = 8; // jours des Roads spéciales
	const NORMAL_DURATION = 22; // jours des Roads normales

	const firstRoadDate = new Date("2025-10-31T00:00:00");

	const elStatus = document.getElementById("roadStatus");
	const elDuration = document.getElementById("roadDuration");
	const elDurationContainer = document.getElementById("roadDurationContainer");
	const elNext = document.getElementById("nextRoad");

	// Debug mode
	const debugDate = null;
	// const debugDate = null; // new Date("2025-10-31")

	function getCurrentAndNext(now) {
		const current = debugDate || now;
		const cycleWeeks = 4;

		let diffDays = Math.floor((current - firstRoadDate) / MS_DAY);
		let completedCycles = diffDays < 0 ? 0 : Math.floor(diffDays / (cycleWeeks * 7));

		const currentRoadStart = new Date(firstRoadDate.getTime() + completedCycles * cycleWeeks * 7 * MS_DAY);
		const currentRoadType = cycle[completedCycles % cycle.length];
		const currentRoadEnd = new Date(currentRoadStart.getTime() + ROAD_DURATION * MS_DAY);

		let nextCycle = (current >= currentRoadStart) ? completedCycles + 1 : completedCycles;
		const nextRoadStart = new Date(firstRoadDate.getTime() + nextCycle * cycleWeeks * 7 * MS_DAY);
		const nextRoadType = cycle[nextCycle % cycle.length];

		let status, durationLeft;

		if (current >= currentRoadStart && current < currentRoadEnd) {
			status = currentRoadType;
			durationLeft = Math.ceil((currentRoadEnd - current) / MS_DAY);
		} else {
			status = "Normal";
			const lastRoadEnd = new Date(currentRoadStart.getTime() + ROAD_DURATION * MS_DAY);
			const normalEnd = nextRoadStart;
			durationLeft = Math.ceil((normalEnd - current) / MS_DAY);
		}

		return { status, durationLeft, nextRoadType, nextRoadStart };
	}

	function formatFullDate(d) {
		return d.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	function update() {
		const now = new Date();
		const data = getCurrentAndNext(now);

		// 🔄 Choix de l'image
		let imgSrc = "";
		switch (data.status) {
			case "Adv":
				imgSrc = "img/RStatus2.png";
				break;
			case "Ex":
				imgSrc = "img/RStatus3.png";
				break;
			default:
				imgSrc = "img/RStatus1.png";
				break;
		}

		// on vide le texte et on ajoute seulement l'image dans le flux visuel mais absolument
		elStatus.innerHTML = `<img src="${imgSrc}" alt="${data.status}" class="roadStatusImg">`;

		elDurationContainer.style.display = "block";
		elDuration.textContent = data.durationLeft + (data.durationLeft === 1 ? " jour" : " jours");

		elNext.innerHTML = `${data.nextRoadType} Road<br>${formatFullDate(data.nextRoadStart)}`;
	}


	update();
	setInterval(update, 60 * 1000);
});

