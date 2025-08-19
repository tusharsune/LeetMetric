document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching ree beta....";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }
            const data = await response.json();
            console.log("Logging data : ", data);

            displayUserData(data);
        }
        catch (error) {
            statsContainer.innerHTML = `<p>No Data Found</p>`;
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        const totalEasyQue = data.totalEasy;
        const totalMediumQue = data.totalMedium;
        const totalHardQue = data.totalHard;

        const totalEasySolved = data.easySolved;
        const totalMediumSolved = data.mediumSolved;
        const totalHardSolved = data.hardSolved;

        updateProgress(totalEasySolved, totalEasyQue, easyLabel, easyProgressCircle);
        updateProgress(totalMediumSolved, totalMediumQue, mediumLabel, mediumProgressCircle);
        updateProgress(totalHardSolved, totalHardQue, hardLabel, hardProgressCircle);

        const cardSdata = [{label:"Rank", value:data.ranking}] 
        console.log("rank : ", cardSdata)

        cardStatsContainer.innerHTML = cardSdata.map(
            data => {
                return `
                <div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                </div>
                `
            }
        )
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Logging username :", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});

