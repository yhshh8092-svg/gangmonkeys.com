document.addEventListener("DOMContentLoaded", function () {
    const gangListContainer = document.getElementById("gangList");
    const userListContainer = document.getElementById("userList");
    const backgroundAudio = document.getElementById("backgroundAudio");
    const clockElement = document.getElementById("clock");
    const timeCheckPopup = document.getElementById("timeCheckPopup");
    const overlay = document.getElementById("overlay");
    const content = document.querySelector(".content");
    const audio = document.getElementById("backgroundAudio");
    const video = document.getElementById("bgVideo");

    audio.volume = 0.3;

    window.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("no-scroll");
        overlay.style.display = "flex";
        overlay.style.position = "fixed";
    });

    overlay.addEventListener("click", playMusicAndHideOverlay);

    function playMusicAndHideOverlay() {
        try {
            let audioPromise = audio.play();
            let videoPromise = video.play();

            Promise.allSettled([audioPromise, videoPromise]).then((results) => {
                let audioResult = results[0];
                let videoResult = results[1];

                if (audioResult.status === "rejected") {
                    console.warn("Audio failed to play:", audioResult.reason);
                }
                if (videoResult.status === "rejected") {
                    console.warn("Video failed to play:", videoResult.reason);
                }

                hideOverlay();
            });
        } catch (error) {
            console.error("Error during playback:", error);
            hideOverlay();
        }
    }

    function hideOverlay() {
        overlay.classList.add("hidden");
        document.body.classList.remove("no-scroll");

        setTimeout(() => {
            overlay.style.display = "none";
            if (content) content.style.display = "block";
        }, 500);
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
        clockElement.textContent = timeString;

        if (hours === 1 || hours === 2) {
            timeCheckPopup.style.display = "block";
        } else {
            timeCheckPopup.style.display = "none";
        }
    }

    loadUsers();
    loadGangs();

    setInterval(updateClock, 1000);
    updateClock();

    function loadUsers() {
        fetch("Users.wtf")
            .then((response) => response.text())
            .then((data) => {
                const usernames = data
                    .split("\n")
                    .map((username) => username.trim())
                    .filter(Boolean);

                userListContainer.innerHTML = "";
                userListContainer.classList.add("card-container");

                usernames.forEach((username, index) => {
                    const userCard = document.createElement("div");
                    userCard.classList.add("kcard");
                    userCard.style.animationDelay = `${index * 0.01}s`;

                    if (username.toLowerCase().includes("(rainbow)")) {
                        const cleanUsername = username.replace("(Rainbow)", "").trim();
                        userCard.innerHTML = `<div class="kcard-body"><p class="rgb-effect">${cleanUsername}</p></div>`;
                    } else {
                        userCard.innerHTML = `<div class="kcard-body"><p>${username}</p></div>`;
                    }

                    userListContainer.appendChild(userCard);
                });

                userListContainer.scrollTop = 0;
            })
            .catch((error) => console.error("Error loading Users.wtf:", error));
    }

    function loadGangs() {
        fetch("Gangs.wtf")
            .then((response) => response.text())
            .then((data) => {
                const gangNames = data
                    .split("\n")
                    .map((gang) => gang.trim())
                    .filter(Boolean);

                gangListContainer.innerHTML = "";
                gangListContainer.classList.add("card-container");

                gangNames.forEach((gang, index) => {
                    const gangCard = document.createElement("div");
                    gangCard.classList.add("kcard");
                    gangCard.style.animationDelay = `${index * 0.01}s`;

                    if (gang.toLowerCase().includes("(rainbow)")) {
                        const cleanGangName = gang.replace("(Rainbow)", "").trim();
                        gangCard.innerHTML = `<div class="kcard-body"><p class="rgb-effect">${cleanGangName}</p></div>`;
                    } else {
                        gangCard.innerHTML = `<div class="kcard-body"><p>${gang}</p></div>`;
                    }

                    gangListContainer.appendChild(gangCard);
                });

                gangListContainer.scrollTop = 0;
            })
            .catch((error) => console.error("Error loading Gangs.wtf:", error));
    }

    function sanitizeText(text) {
        return text.replace(/\(Rainbow\)|\(Border\)/gi, "").trim();
    }

    function renderUsers(usernames) {
        userListContainer.innerHTML = "";
        userListContainer.classList.add("card-container");

        usernames.forEach((username, index) => {
            const userCard = document.createElement("div");
            userCard.classList.add("kcard");
            userCard.style.animationDelay = `${index * 0.01}s`;

            const cleanUsername = sanitizeText(username);
            const isRainbow = username.toLowerCase().includes("(rainbow)");
            const hasBorder = username.toLowerCase().includes("(border)");

            const usernameWithoutBorder = username.replace(/\(Rainbow\)|\(Border\)/gi, "").trim();

            const effects = `
        ${isRainbow ? '<span class="rgb-effect">' : ''}
        ${usernameWithoutBorder}
        ${isRainbow ? '</span>' : ''}
    `;

            userCard.innerHTML = `<div class="kcard-body"><p>${effects}</p></div>`;

            if (hasBorder) {
                userCard.classList.add("block");
            }

            userListContainer.appendChild(userCard);
        });

        userListContainer.scrollTop = 0;
    }

    function renderGangs(gangNames) {
        gangListContainer.innerHTML = "";
        gangListContainer.classList.add("card-container");

        gangNames.forEach((gang, index) => {
            const gangCard = document.createElement("div");
            gangCard.classList.add("kcard");
            gangCard.style.animationDelay = `${index * 0.01}s`;

            const cleanGangName = sanitizeText(gang);
            const isRainbow = gang.toLowerCase().includes("(rainbow)");

            const effects = `
        ${isRainbow ? '<span class="rgb-effect">' : ''}
        ${cleanGangName}
        ${isRainbow ? '</span>' : ''}
    `;

            gangCard.innerHTML = `<div class="kcard-body"><p>${effects}</p></div>`;
            gangListContainer.appendChild(gangCard);
        });

        gangListContainer.scrollTop = 0;
    }

    function filterContent() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = allUsers.filter((user) => user.toLowerCase().includes(searchTerm));
        const filteredGangs = allGangs.filter((gang) => gang.toLowerCase().includes(searchTerm));

        renderUsers(filteredUsers);
        renderGangs(filteredGangs);
    }

    searchInput.addEventListener("input", filterContent);

    loadUsers();
    loadGangs();
});

document.addEventListener("DOMContentLoaded", function () {
    const gangListContainer = document.getElementById("gangList");
    const userListContainer = document.getElementById("userList");
    const searchInput = document.getElementById("search-input");
    const volumeSlider = document.getElementById("volume-slider");
    const video = document.getElementById("bgVideo");
    const audioElements = document.querySelectorAll("audio");
    let allUsers = [];
    let allGangs = [];

    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        
    });

    video.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    function loadUsers() {
        fetch("Users.wtf")
            .then((response) => response.text())
            .then((data) => {
                allUsers = data
                    .split("\n")
                    .map((username) => username.trim())
                    .filter(Boolean);
                renderUsers(allUsers);
            })
            .catch((error) => console.error("Error loading Users.wtf:", error));
    }

    function loadGangs() {
        fetch("Gangs.wtf")
            .then((response) => response.text())
            .then((data) => {
                allGangs = data
                    .split("\n")
                    .map((gang) => gang.trim())
                    .filter(Boolean);
                renderGangs(allGangs);
            })
            .catch((error) => console.error("Error loading Gangs.wtf:", error));
    }

    function sanitizeText(text) {
        return text.replace(/\(Border\)|\(Rainbow\)|\(Glow\)/gi, "").trim();
    }

    function renderUsers(usernames) {
        userListContainer.innerHTML = "";
        userListContainer.classList.add("card-container");

        usernames.forEach((username, index) => {
            const userCard = document.createElement("div");
            userCard.classList.add("kcard");
            userCard.style.animationDelay = `${index * 0.01}s`;

            const cleanUsername = sanitizeText(username);
            const isRainbow = username.toLowerCase().includes("(rainbow)");
            const hasBorder = username.toLowerCase().includes("(border)");
            const isGold = username.toLowerCase().includes("(glow)");

            const usernameWithoutEffects = username.replace(/\(Rainbow\)|\(Border\)|\(Glow\)/gi, "").trim();

            const effects = `
            ${isRainbow ? '<span class="rgb-effect">' : ''}
            ${isGold ? '<span class="gold-effect">' : ''}
            ${usernameWithoutEffects}
            ${isGold ? '</span>' : ''}
            ${isRainbow ? '</span>' : ''}
        `;

            userCard.innerHTML = `<div class="kcard-body"><p>${effects}</p></div>`;

            if (isGold) {
                userCard.classList.add("glow");
            }

            if (hasBorder) {
                userCard.classList.add("block");
            }

            userListContainer.appendChild(userCard);
        });

        userListContainer.scrollTop = 0;
    }

    function renderGangs(gangNames) {
        gangListContainer.innerHTML = "";
        gangListContainer.classList.add("card-container");
    
        gangNames.forEach((gang, index) => {
            const gangCard = document.createElement("div");
            gangCard.classList.add("kcard");
            gangCard.style.animationDelay = `${index * 0.01}s`;
    
            const cleanGangName = sanitizeText(gang);
            const isRainbow = gang.toLowerCase().includes("(rainbow)");
            const isGold = gang.toLowerCase().includes("(glow)");
            const hasBorder = gang.toLowerCase().includes("(border)");
    
            const effects = `
            ${isRainbow ? '<span class="rgb-effect">' : ''}
            ${isGold ? '<span class="glow-effect">' : ''}
            ${cleanGangName}
            ${isGold ? '</span>' : ''}
            ${isRainbow ? '</span>' : ''}
            `;
    
            gangCard.innerHTML = `<div class="kcard-body"><p>${effects}</p></div>`;
    
            if (isGold) {
                gangCard.classList.add("glow");
            }
    
            if (hasBorder) {
                gangCard.classList.add("block");
            }
    
            gangListContainer.appendChild(gangCard);
        });
    
        gangListContainer.scrollTop = 0;
    }
    
    function filterContent() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = allUsers.filter((user) => user.toLowerCase().includes(searchTerm));
        const filteredGangs = allGangs.filter((gang) => gang.toLowerCase().includes(searchTerm));

        renderUsers(filteredUsers);
        renderGangs(filteredGangs);
    }

    searchInput.addEventListener("input", filterContent);

    function saveVolumeToLocalStorage(volume) {
        localStorage.setItem("audioVolume", volume);
    }

    function getVolumeFromLocalStorage() {
        return localStorage.getItem("audioVolume") || 0.5;
    }

    function setVolumeForAllAudio(volume) {
        audioElements.forEach(audio => {
            audio.volume = volume;
        });
    }

    const savedVolume = parseFloat(getVolumeFromLocalStorage());
    volumeSlider.value = savedVolume;
    setVolumeForAllAudio(savedVolume);

    volumeSlider.addEventListener("input", () => {
        const currentVolume = parseFloat(volumeSlider.value);
        setVolumeForAllAudio(currentVolume);
        saveVolumeToLocalStorage(currentVolume);
    });

    loadUsers();
    loadGangs();
});

document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("bgVideo");

    video.addEventListener("fullscreenchange", (event) => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    video.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
});

 const audioElements = document.querySelectorAll("audio");
 const volumeSlider = document.getElementById("volume-slider");

 function saveVolumeToLocalStorage(volume) {
     localStorage.setItem("audioVolume", volume);
 }

 function getVolumeFromLocalStorage() {
     return localStorage.getItem("audioVolume") || 0.5;
 }

 function setVolumeForAllAudio(volume) {
     audioElements.forEach(audio => {
         audio.volume = volume;
     });
 }

 document.addEventListener("DOMContentLoaded", () => {
     const savedVolume = parseFloat(getVolumeFromLocalStorage());
     volumeSlider.value = savedVolume;
     setVolumeForAllAudio(savedVolume);

     console.log(`Loaded saved volume: ${savedVolume}`);
 });

 volumeSlider.addEventListener("input", () => {
     const currentVolume = parseFloat(volumeSlider.value);
     setVolumeForAllAudio(currentVolume);
     saveVolumeToLocalStorage(currentVolume);
     console.log(`Volume updated to: ${currentVolume}`);
 });



resetButton.addEventListener("click", async () => {
  if (currentUser && currentUser.displayName === "admin" || currentUser.displayName === "LARP" ) {
    try {
      const chatsQuery = query(collection(db, "chats"));

    
      const snapshot = await getDocs(chatsQuery);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      alert("All messages have been deleted.");
    } catch (error) {
      errorMsg.textContent = "Error resetting messages: " + error.message;
    }
  }   
});
