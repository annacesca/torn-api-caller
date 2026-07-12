const PROFILE_API = "https://torn-api-xi.vercel.app/api/profile";
const TRAVEL_API = "https://torn-api-xi.vercel.app/api/travel";
const RECO_WALLET_1_3 = "https://torn-api-xi.vercel.app/api/reco-money-1-3";

let travelInterval;

const $ = (id) => document.getElementById(id);

const formatMoney = (value) => {
    if (value == null) return "$0";

    return "$" + Number(value).toLocaleString();
};

const formatNumber = (value) => {
    if (value == null) return "0";

    return Number(value).toLocaleString();
};

function setBar(id, current, maximum) {

    const percent = maximum > 0
        ? (current / maximum) * 100
        : 0;

    $(id).style.width = `${Math.min(percent,100)}%`;
}

async function loadProfile() {

    try {

        const response = await fetch(PROFILE_API);

        if (!response.ok)
            throw new Error("Unable to contact API.");

        const data = await response.json();

        console.log(data);

        //------------------------
        // PROFILE
        //------------------------

        $("playerName").textContent =
            data.name ?? "Unknown";

        $("playerLevel").textContent =
            `Level ${data.level ?? "--"}`;

        $("playerRank").textContent =
            data.rank ?? "--";

        $("playerFaction").textContent =
            data.faction?.faction_name ??
            data.faction?.name ??
            "None";

        $("playerJob").textContent =
            data.job?.company_name ??
            data.job?.position ??
            "None";

        $("playerTravel").textContent =
            data.travel?.destination ??
            "Torn";

        //------------------------
        // HAPPY
        //------------------------

        const happyCurrent =
            data.happy?.current ??
            data.happy ??
            0;

        const happyMax =
            data.happy?.maximum ??
            data.happy?.max ??
            happyCurrent;

        $("happyText").textContent =
            `${formatNumber(happyCurrent)} / ${formatNumber(happyMax)}`;

        setBar(
            "happyBar",
            happyCurrent,
            happyMax
        );

        //------------------------
        // ENERGY
        //------------------------

        const energyCurrent =
            data.energy?.current ??
            data.energy ??
            0;

        const energyMax =
            data.energy?.maximum ??
            data.energy?.max ??
            energyCurrent;

        $("energyText").textContent =
            `${energyCurrent} / ${energyMax}`;

        setBar(
            "energyBar",
            energyCurrent,
            energyMax
        );

        //------------------------
        // NERVE
        //------------------------

        const nerveCurrent =
            data.nerve?.current ??
            data.nerve ??
            0;

        const nerveMax =
            data.nerve?.maximum ??
            data.nerve?.max ??
            nerveCurrent;

        $("nerveText").textContent =
            `${nerveCurrent} / ${nerveMax}`;

        setBar(
            "nerveBar",
            nerveCurrent,
            nerveMax
        );

        //------------------------
        // LIFE
        //------------------------

        const lifeCurrent =
            data.life?.current ??
            data.life ??
            0;

        const lifeMax =
            data.life?.maximum ??
            data.life?.max ??
            lifeCurrent;

        $("lifeText").textContent =
            `${lifeCurrent} / ${lifeMax}`;

        setBar(
            "lifeBar",
            lifeCurrent,
            lifeMax
        );

        //------------------------
        // STATS
        //------------------------

        $("strength").textContent =
            formatNumber(data.personalstats.strength);

        $("speed").textContent =
            formatNumber(data.personalstats.speed);

        $("dexterity").textContent =
            formatNumber(data.personalstats.dexterity);

        $("defense").textContent =
            formatNumber(data.personalstats.defense);

        $("totalstats").textContent =
            formatNumber(data.personalstats.totalstats);

        //------------------------
        // ACTIVITY
        //------------------------

        const activity =
            $("activityList");

        activity.innerHTML = "";

        if (data.last_action) {

            const li =
                document.createElement("li");

            li.textContent =
                `Last Action • ${data.last_action.status}`;

            activity.appendChild(li);

        }

        if (data.status?.description) {

            const li =
                document.createElement("li");

            li.textContent =
                data.status.description;

            activity.appendChild(li);

        }

        if (!activity.children.length) {

            activity.innerHTML =
                "<li>No recent activity.</li>";

        }

    }
    catch (err) {

        console.error(err);

        $("playerName").textContent =
            "Connection Error";

        alert(err.message);

    }

}

async function loadTravel() {

    try {

        const response = await fetch(TRAVEL_API);

        const data = await response.json();

        startTravelTimer(data.travel);

    }
    catch(err){

        console.error(err);

    }

}

function startTravelTimer(travel) {

    if (travelInterval)
        clearInterval(travelInterval);

    updateTravel(travel);

    travelInterval = setInterval(() => {

        updateTravel(travel);

    },1000);

}

function updateTravel(travel) {

    const now = Math.floor(Date.now()/1000);

    const remaining = travel.timestamp - now;

    const activity = document.getElementById("activityList");

    if(remaining <= 0){

        clearInterval(travelInterval);

        activity.innerHTML = `
            <li>
                ✈️ Arrived in ${travel.destination}
            </li>
        `;

        return;

    }

    const hours = Math.floor(remaining/3600);

    const minutes = Math.floor((remaining%3600)/60);

    const seconds = remaining%60;

    activity.innerHTML = `
        <li>
            ✈️ Traveling to <strong>${travel.destination}</strong><br>
            ETA: ${hours}h ${minutes}m ${seconds}s
        </li>
    `;

}

async function loadRecommendations(endpoint, title){

    $("recoTitle").textContent = title;

    const response = await fetch(endpoint);

    const data = await response.json();

    $("reco1").textContent =
        `🥇 ${data[0].destination} — ${data[0].item}`;

    $("reco2").textContent =
        `🥈 ${data[1].destination} — ${data[1].item}`;

    $("reco3").textContent =
        `🥉 ${data[2].destination} — ${data[2].item}`;

}

const tabs=document.querySelectorAll(".reco-tab");

tabs.forEach(tab=>{

    tab.addEventListener("click",()=>{

        tabs.forEach(t=>t.classList.remove("active"));

        tab.classList.add("active");

        switch(tab.dataset.tab){

            case "fast":

                loadRecommendations(

                    "https://torn-api-xi.vercel.app/api/reco-fast-1-3",

                    "⚡ Fastest Profit"

                );

                break;

            case "wallet":

                loadRecommendations(

                    "https://torn-api-xi.vercel.app/api/reco-money-1-3",

                    "💰 Based on Wallet"

                );

                break;

            case "travel":

                loadRecommendations(

                    "https://torn-api-xi.vercel.app/api/reco-plushies-1-3",

                    "🧸 Plushies & Flowers"

                );

                break;

        }

    });

});

$("refreshButton").addEventListener("click", () => {

    loadProfile();
    loadTravel();
    loadRecommendations(

        "https://torn-api-xi.vercel.app/api/reco-fast-1-3",
    
        "⚡ Fastest Profit"
    
    );

});



loadProfile();
loadTravel();
    loadRecommendations(

        "https://torn-api-xi.vercel.app/api/reco-fast-1-3",
    
        "⚡ Fastest Profit"
    
    );
