// Отримуємо дані з сервера
async function getData() {
	try {
    const response = await axios.get('https://65c3491439055e7482c07ed5.mockapi.io/table-data');
    const result = response.data;
		return result
	} catch (error) {
			console.error('Помилка отримання даних:', error);
	}

}


// Функція отримує список задач, виводить їх на екран та різні маніпуляції з кнопками
async function main() {
	// Отримуємо всі елементи та будемо їх виводити на екран
	const data = await getData();
	let page = new URLSearchParams(window.location.search).get("page");
	// console.log(page);
	if(page == null) {
		page = 1;
	}
	let currentPage = page;
	let row = 8;
	let load = 	document.querySelector( '.table' );

	function displayList(arrData, rowPerPage, page) {
		load.classList.remove('visible')
		page--;
		const tableBody = document.querySelector( '.table-body' );
		tableBody.innerHTML = '';
		const start = rowPerPage * page;
		const end = start + rowPerPage;
		const paginationData = arrData.slice(start, end);

		paginationData.forEach(item => {
			createTasks(item)
		})
		// Функція яка створює задачу та приймає потрібні параметри
		function createTasks(item) {
				let html = `<tr>
				<td>${item.name}</td>
				<td>${item.company}</td>
				<td>${item.number}</td>
				<td>${item.email}</td>
				<td>${item.country}</td>
				<td><div class="${item.status}">${item.status}</div></td>
			</tr>`
				tableBody.insertAdjacentHTML('afterbegin', html)
		};

	};

	// Якщо атрибут "page" існує, отримуємо його значення та проводимо маніпуляції з кнопками навігацій
	function getPageParamsFromUrl() {
		let url = new URL(window.location.href);
		if (url.searchParams.has('page')) {
			let pageValue = url.searchParams.get('page');
			// let buttonPaginations = document.querySelectorAll( '.pagination__item' );
			// let prevButtonActive = document.querySelector( '.pagination__item.active' );
			if(pageValue <= data.length) {
				load.classList.add('visible')
				displayList(data, row, pageValue );
			}else {
				load.classList.add('visible')
				displayList(data, row, 1 );
			}
		}
	}
	displayList(data, row, currentPage );
	getPageParamsFromUrl()
	
	
	// Функція пошуку
	function search() {
		const searchTerm = document.getElementById("searchInput").value.toLowerCase();

		const searchResults = data.filter(item => {
			// Порівнюємо кожен елемент даних зі строкою пошуку
			return Object.values(item).some(value =>
				typeof value === 'string' && value.toLowerCase().includes(searchTerm)
			);
		});
		if(searchResults.length == data.length) {
			document.querySelector( '.pagination' ).classList.remove('hidden')
			displayList(searchResults, row, 1);
			
		}else {
			document.querySelector( '.pagination' ).classList.add('hidden')
			displayList(searchResults, searchResults.length, 1);
		}
	}
	document.querySelector( '#searchInput' ).addEventListener('input', search)



	// Створюємо кнопки навігації по сторінкам даних
	let pagination = document.querySelector( '.pagination' );
	let pageNumber = page || 1
	let totalPage = Math.ceil(data.length / row)
	pagination.innerHTML = paginationFunction(totalPage, pageNumber);
	function paginationFunction(totalPage, pageNumber) {
		pageNumber = +pageNumber
		let beforePage = pageNumber - 1,  afterPage = pageNumber + 1;
		let listTag = "";
		if(pageNumber == 1) {
			listTag += ` <button disabled class="prev pagination_item""><</button>`;
		} else {
			listTag += ` <button  class="prev pagination_item" ><</button>`;
		}
		
		if (pageNumber > 2) {
				listTag += `<button class="pagination_item" ">1</button>`;

				if (pageNumber > 3) {
						listTag += `<span >...</span>`;
				}
		}
		if(pageNumber == totalPage) {
			beforePage = beforePage - 2;
		} else if (pageNumber == totalPage - 1) {
			beforePage = beforePage - 1;
		}
		if(pageNumber == 1) {
			afterPage = afterPage + 2;
		} else if (pageNumber == 2) {
			afterPage = afterPage + 1;
		}
		for ( let index = beforePage; index <= afterPage; index++) {
			if (totalPage < index) {
				break;
			}
			if (index == 0) {
					index = index + 1;
			}
			if(pageNumber == index) {
				active = "active"
			} else {
				active = ""
			}
			listTag +=`<button class="pagination_item ${active}">${index}</button>`
			}
			if (pageNumber < totalPage - 1) {
				if (pageNumber < totalPage - 2) {
						listTag += `<span >...</span>`;
				}
				listTag += `<button class="pagination_item " >${totalPage}</button>`;
		}
		if(pageNumber == totalPage) {
			listTag += `<button disabled class="next pagination_item">></button>`;
		} else {
			listTag += `<button class="next pagination_item" >></button>`;
		}


		pagination.innerHTML = listTag;
			return listTag
	}

	// Шукаємо та навішуємо подію клік на кнопки вперед, назад, та кнопки сторінок для переключення між сторінками
	let prev = document.querySelector('.prev.pagination_item');
	let next = document.querySelector('.next.pagination_item');
	let itemsPages = document.querySelectorAll( '.pagination_item' );
	itemsPages.forEach(el => {
		el.addEventListener('click', () => {
			let count = el.innerHTML;
			// Отримуємо поточний URL
			let url = new URL(window.location.href);
			// Змінюємо параметр "page" 
			url.searchParams.set('page', count);
			// Замінюємо поточний URL на новий з параметрами
			window.history.replaceState({}, '', url);
			window.location.reload()
		})
	})
	prev.addEventListener('click', () => {
		let activeElement = +document.querySelector('.pagination_item.active').innerHTML;
		// Отримуємо поточний URL
		let url = new URL(window.location.href);
		// Змінюємо параметр "page" 
		url.searchParams.set('page', activeElement - 1);
		// Замінюємо поточний URL на новий з параметрами
		window.history.replaceState({}, '', url);
		window.location.reload()
	});

	next.addEventListener('click', () => {
		let activeElement = +document.querySelector('.pagination_item.active').innerHTML;
		// Отримуємо поточний URL
		let url = new URL(window.location.href);
		// Змінюємо параметр "page" 
		url.searchParams.set('page', activeElement + 1);
		// Замінюємо поточний URL на новий з параметрами
		window.history.replaceState({}, '', url);
		window.location.reload()
	});

}
main()
// При кліку на логотип додається клас active та вилізає меню
let logo = document.querySelector( '.navigation__logo img' );
logo.addEventListener('click', (e) => {
	e.preventDefault()
	document.querySelector( '.navigation' ).classList.toggle('active')
	document.querySelector( '.wrapper' ).classList.toggle('active')
})
window.addEventListener('click', (e) => {
	if(e.target.classList.contains('active')) {
		document.querySelector( '.navigation' ).classList.toggle('active')
	document.querySelector( '.wrapper' ).classList.toggle('active')
	}
})