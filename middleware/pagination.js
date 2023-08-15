const fetch = require('node-fetch');

async function fetchDataFromAPI(adminID, page) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/GetAllCustomers/${adminID}?page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw error;
    }
}

module.exports = { fetchDataFromAPI };
