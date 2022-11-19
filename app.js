const cities = ['Budapest', 'Győr', 'Debrecen', 'Miskolc', 'Pécs', 'Sopron', 'Szeged', 'Gyékényes'];

renderSelect();

function renderSelect() {
    let selectValues = document.getElementById('cities');

    for (let city in cities) {
        selectValues.innerHTML += `
            <option value="${cities[city]}">${cities[city]}</option>
        `;
    }
}