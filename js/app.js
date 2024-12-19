const selectCryptocurrency = document.querySelector('#cryptocurrencies');
const selectCurrency = document.querySelector('#currency');
const form = document.querySelector('#form');
const result = document.querySelector('#result');

const objSearch = {
    currency: '',
    crypto: ''
}

const getCrypto = cryptocurrencies => new Promise( resolve => {
    resolve(cryptocurrencies);
})

document.addEventListener('DOMContentLoaded', () => {
    consultCrypto();

    form.addEventListener('submit', submitForm);

    selectCryptocurrency.addEventListener('change', readValue);
    selectCurrency.addEventListener('change', readValue);
})

async function consultCrypto() {
    const url = 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD';

    try {
        const response = await fetch(url);
        const result = await response.json();
        const cryptocurrencies = await getCrypto(result.Data)
        selectCrypto(cryptocurrencies)
    } catch (error) {
        console.log(error)
    }
}

function selectCrypto(cryptocurrencies) {
    cryptocurrencies.forEach ( crypto => {
        const { FullName, Name } = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        selectCryptocurrency.appendChild(option);
    })
}

function readValue(e) {
    objSearch[e.target.name] = e.target.value;
    console.log(objSearch)
}

function submitForm(e) {
    e.preventDefault();

    const { currency, cryptocurrencies } = objSearch;

    if(currency === '' || cryptocurrencies === '') {
        showError('Ambos campos son obligatorios');
        return;
    }

    consultAPI();
}

function showError(msg) {
    const errorExist = document.querySelector('.error_message');

    if(!errorExist) {
        const messageContent = document.createElement('DIV');

        messageContent.classList.add('error_message');
        messageContent.textContent = msg;
        form.appendChild(messageContent);

        setTimeout(() => {
            messageContent.remove();
        }, 5000);
    }
}

async function consultAPI() {
    const { currency, cryptocurrencies } = objSearch;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrencies}&tsyms=${currency}`;

    showSpinner();

    try {
        const response = await fetch(url);
        const quote = await response.json();
        showQuote(quote.DISPLAY[cryptocurrencies][currency]);
    } catch (error) {
        console.log(error);
    }
}

function showQuote(quote) {

    clearHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR } = quote;

    const price = document.createElement('P');
    price.classList.add('price');
    price.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const highDay = document.createElement('P');
    highDay.innerHTML = `El precio más alto del día es: <span>${HIGHDAY}</span>`;
    
    const lowDay = document.createElement('P');
    lowDay.innerHTML = `El precio más bajo del día es: <span>${LOWDAY}</span>`;

    const pct = document.createElement('P');
    pct.innerHTML = `Variación en las últimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`;

    result.appendChild(price);
    result.appendChild(highDay);
    result.appendChild(lowDay);
    result.appendChild(pct);
}

function clearHTML() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    clearHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    result.appendChild(spinner);
}