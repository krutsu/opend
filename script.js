const domain = 'https://openday.kumaraguru.in/api/v1';
const itemsPerPage = 10;
let currentPage = 1;
let departments = [];

function fetchDepartments() {
    fetch(`${domain}/departments/`)
        .then(response => response.json())
        .then(data => {
            departments = data;
            displayDepartments();
            setupPagination();
        })
        .catch(err => {
            document.getElementById('alldepartments').innerHTML = `
                <div style="text-align: center; font-family: Georgia, 'Times New Roman', Times, serif; color: red;">
                    <h2>Error! Some Error in Fetching Data</h2>
                    <h4>Error Details: ${err}</h4>
                </div>`;
        });
}

function displayDepartments() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleDepts = departments.slice(start, end);

    const deptHtml = visibleDepts.map(depart => `
        <div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://picsum.photos/id/${depart.id}/300/200);"
            onclick="clicked(this);" id="${depart.id}" class="depts">
            <h3>${depart.name}</h3>
        </div>`).join('');

    document.getElementById('alldepartments').innerHTML = deptHtml;
}


function setupPagination() {
    const totalPages = Math.ceil(departments.length / itemsPerPage);
    const prevButton = document.querySelector('#page button:first-of-type');
    const nextButton = document.querySelector('#page button:last-of-type');

    function updatePagination() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayDepartments();
            updatePagination();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayDepartments();
            updatePagination();
        }
    });

    updatePagination();
}

function handleSearch() {
    const query = document.getElementById('searchBar').value.toUpperCase();
    const deptElements = document.querySelectorAll('.depts');

    deptElements.forEach(dept => {
        const name = dept.querySelector('h3').textContent.toUpperCase();
        dept.style.display = name.includes(query) ? 'block' : 'none';
    });

  
    setupPagination();
}


document.getElementById('searchBar').addEventListener('input', handleSearch);


fetchDepartments();
function clicked(item) {
    const id = item.id;
    const domain = 'https://openday.kumaraguru.in/api/v1';
    const url = `${domain}/department/${id}`;

    fetch(url)
        .then(response => response.json())
        .then(res => {
            const depname = `<h1>Department Name: ${res.name}</h1>`;
            const departimage = `<img src="https://picsum.photos/id/${id}/200/300" alt="Department ${id}">`;
            const descp = `
                <h2>Description: ${res.description}</h2>
                <h2>Block: ${res.block}</h2>
                <h2>Link: <a href="${res.link}" target="_blank">${res.link}</a></h2>
            `;

            localStorage.setItem('depname', depname);
            localStorage.setItem('departimage', departimage);
            localStorage.setItem('descp', descp);

            window.location.href = 'department.html';
        })
        .catch(err => console.log('Error:', err));
}

