const search = document.getElementById('search-bar');
const header = document.querySelector('h2');
const pronounce = document.querySelector('.pronounce');
const phoneAudio = document.querySelector('.phone-audio');
const play = document.querySelector('.play-button');
const main = document.querySelector('.main-div');
const magn = document.querySelector('.fa-magnifying-glass');



let flag = 0;
let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/usage'


const fetchData = async (url) => {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data[0];
	} catch (error) {
		console.error(error);
		return null;
	}
};

fetchData();

search.addEventListener(('keypress'), async (event)=> {
	if (event.key == 'Enter' && search.value) {
		display();
		search.value = '';
	}
})

magn.addEventListener('click', ()=> {
	display();
	search.value = '';
})

const removePreviousElements = ()=> {
	const previousElements = document.querySelectorAll('.toRemove');
	if (previousElements) {
		previousElements.forEach(element => {
			element.remove();
			header.innerHTML = '';
			pronounce.innerHTML = '';
			play.style.display = 'none';
		});
	}
	const previousError = document.querySelector('.error');
	if (previousError) {
		previousError.remove();
	}
}

const phonetics = (data) => {
	if (data.phonetics.length === 0) {
		pronounce.innerText = 'no phonetic'
	}
	else if (data.phonetic) {
		pronounce.innerText = data.phonetic;
		phoneAudio.src = data.phonetics[0].audio;
	}
	else {
		pronounce.innerText = data.phonetics[1].text;
		phoneAudio.src = data.phonetics[0].audio;
	}
}

const notFound = ()=> {
	const error = document.createElement('h3');
	error.classList.add('error');
	error.innerText = 'there is no such word on the server';
	main.appendChild(error);
}

const renderStuff =  (data) => {
	flag = 1;
	console.log(data);
	play.style.display = 'flex';
	header.innerText = data.word;
	phonetics(data);
	const meanings = data.meanings;
	meanings.forEach(meaning => {
		const element = document.createElement('div');
		element.classList.add('toRemove');
		const listt = document.createElement('ul');
		listt.classList.add('listt');
		element.innerHTML = `
		<div class="container">
		<div class="word-and-line">
		<span>${meaning.partOfSpeech}</span>
		<hr id="line">
		</div>
		<span id="meaning">Meaning</span>
		</div>`
		meaning.definitions.forEach(defin => {
			const list = document.createElement('li');
			list.innerText = defin.definition;
			listt.appendChild(list);
		})
		element.appendChild(listt);
		main.appendChild(element);
	});
}

const display = async() => {
	let data;
	url =  'https://api.dictionaryapi.dev/api/v2/entries/en/' + search.value;
	try {
		data = await fetchData(url);
	} catch (error) {
		console.log('hello');
	}
	removePreviousElements();
	if (data === undefined) {
		notFound();
		return;
	}
	renderStuff(data);
}

play.addEventListener('click', ()=> {
	if (flag) {
		phoneAudio.play();
	}
})

