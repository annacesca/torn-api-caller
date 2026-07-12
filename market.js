// ===============================
// Torn Companion - Market Explorer
// Part 1
// ===============================

const API = {

    fast: "https://torn-api-xi.vercel.app/api/reco-fast-1-3",

    wallet: "https://torn-api-xi.vercel.app/api/reco-money-1-3",

    travel: "https://torn-api-xi.vercel.app/api/reco-plushies-1-3"

};

let currentMode = "fast";

let marketData = [];

let filteredData = [];

let currentSort = "rank";

let sortAscending = true;


// ===============================
// Helper
// ===============================

const $ = (id) => document.getElementById(id);


// ===============================
// Initial Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    setupTabs();

    setupRefresh();

    loadMarket("fast");

});


// ===============================
// Tabs
// ===============================

function setupTabs() {

    const tabs = document.querySelectorAll(".market-tab");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            loadMarket(tab.dataset.mode);

        });

    });

}


// ===============================
// Refresh Button
// ===============================

function setupRefresh() {

    $("refreshBtn").addEventListener("click", () => {

        loadMarket(currentMode);

    });

}


// ===============================
// Load API
// ===============================

async function loadMarket(mode) {

    currentMode = mode;

    $("marketBody").innerHTML = `

        <tr>

            <td colspan="10" class="loading">

                Loading market...

            </td>

        </tr>

    `;

    try {

        const response = await fetch(API[mode]);

        marketData = await response.json();

        filteredData = [...marketData];

        updateHeader();

        updateLastUpdated();

        renderTable();

    }

    catch (err) {

        console.error(err);

        $("marketBody").innerHTML = `

            <tr>

                <td colspan="10" class="error">

                    Failed to load market.

                </td>

            </tr>

        `;

    }

}


// ===============================
// Header Text
// ===============================

function updateHeader() {

    switch (currentMode) {

        case "fast":

            $("marketTitle").textContent =
                "⚡ Fastest (Profit / Minute)";

            $("currentMode").textContent =
                "Fastest";

            break;

        case "wallet":

            $("marketTitle").textContent =
                "💰 Wallet Recommendation";

            $("currentMode").textContent =
                "Wallet";

            break;

        case "travel":

            $("marketTitle").textContent =
                "🧸 Plushies & Flowers";

            $("currentMode").textContent =
                "Plushies";

            break;

    }

}


// ===============================
// Last Updated
// ===============================

function updateLastUpdated() {

    const now = new Date();

    $("lastUpdated").textContent =
        now.toLocaleTimeString();

}

// ===============================
// Render Table
// ===============================

function renderTable() {

    const tbody = $("marketBody");

    tbody.innerHTML = "";

    if (filteredData.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="10">

                    No items found.

                </td>

            </tr>

        `;

        $("totalResults").textContent = "0";

        return;

    }

    filteredData.forEach(item => {

        let medal = item.rank;

        let rankClass = "";

        if (item.rank === 1) {

            medal = "🥇";

            rankClass = "rank-1";

        }

        else if (item.rank === 2) {

            medal = "🥈";

            rankClass = "rank-2";

        }

        else if (item.rank === 3) {

            medal = "🥉";

            rankClass = "rank-3";

        }

        const row = document.createElement("tr");

        row.innerHTML = `

            <td class="${rankClass}">

                ${medal}

            </td>

            <td>

                ${item.country}

            </td>

            <td>

                ${item.item}

            </td>

            <td>

                ${money(item.cost)}

            </td>

            <td>

                ${number(item.quantity)}

            </td>

            <td>

                ${money(item.totalCost)}

            </td>

            <td>

                ${number(item.stock)}

            </td>

            <td>

                ${item.travelTime} min

            </td>

            <td>

                ${money(item.tripProfit)}

            </td>

            <td>

                ${money(Math.round(item.profitPerMinute))}

            </td>

        `;

        tbody.appendChild(row);

    });

    $("totalResults").textContent = filteredData.length;

}


// ===============================
// Money Formatter
// ===============================

function money(value) {

    if (value == null)
        return "-";

    return "$" + Number(value).toLocaleString();

}


// ===============================
// Number Formatter
// ===============================

function number(value) {

    if (value == null)
        return "-";

    return Number(value).toLocaleString();

}
