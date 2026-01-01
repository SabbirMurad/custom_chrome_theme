const DB_NAME = "themeDB";
const STORE_NAME = "videos";
const VIDEO_KEY = "backgroundVideo";

const preset_backgrounds = ['Confused Frieren', 'Hornet Waterfall', 'Japanese Phonk'];
const videoInput = document.querySelector("#settings-sidebar .video-selector #videoInput")

// Open DB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 2);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("settings")) {
                db.createObjectStore("settings");
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function generateVideoThumbnail(file) {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.currentTime = 1;

        video.onloadeddata = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas
                .getContext("2d")
                .drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => resolve(blob), "image/png");
        };
    });
}

async function saveUserVideo(file) {
    const db = await openDB();
    const thumbnail = await generateVideoThumbnail(file);

    const videoObj = {
        id: crypto.randomUUID(),
        type: "user",
        name: file.name,
        videoSrc: file,
        thumbnail,
        createdAt: Date.now()
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction("videos", "readwrite");
        tx.objectStore("videos").add(videoObj);
        tx.oncomplete = () => resolve(videoObj);
        tx.onerror = reject;
    });
}

async function insertPresetVideosOnce() {
    const db = await openDB();

    const settingsTx = db.transaction("settings", "readonly");
    const flagReq = settingsTx.objectStore("settings").get("presetsInserted");

    flagReq.onsuccess = async () => {
        if (flagReq.result) return; // ✅ already done

        const tx = db.transaction("videos", "readwrite");
        const store = tx.objectStore("videos");

        preset_backgrounds.forEach(name => {
            store.put({
                id: `preset-${toDashCase(name)}`,
                type: "preset",
                name,
                videoSrc: `assets/video/${toDashCase(name)}.mp4`,
                thumbnail: `assets/video/${toDashCase(name)}.png`
            });
        });

        tx.oncomplete = () => {
            const flagTx = db.transaction("settings", "readwrite");
            flagTx.objectStore("settings").put(true, "presetsInserted");
        };
    };
}

async function loadAllVideos() {
    const db = await openDB();

    return new Promise(resolve => {
        const tx = db.transaction("videos", "readonly");
        const request = tx.objectStore("videos").getAll();
        request.onsuccess = () => resolve(request.result);
    });
}

async function renderVideoGallery() {
    const wrapper = document.querySelector('.available-videos');
    wrapper.innerHTML = "";

    const videos = await loadAllVideos();
    const selectedId = await getSelectedVideoId();

    videos.forEach(video => {
        const item = document.createElement("div");
        item.className = `item ${video.id === selectedId ? "active" : ""}`;

        const isSelected = video.id === selectedId;

        if (isSelected) item.classList.add('selected');

        const thumbSrc =
            video.type === "user"
                ? URL.createObjectURL(video.thumbnail)
                : video.thumbnail;

        item.innerHTML = `
            <div class="bg-wrapper">
              <img class="background" src="${thumbSrc}">
              <div class="overlay"></div>
              <img src="/assets/icon/check-circle.svg" class="check">
            </div>
            <p>${video.name}</p>
        `;

        item.onclick = () => selectVideo(video);
        wrapper.appendChild(item);
    });
}

async function setSelectedVideo(id) {
    const db = await openDB();
    const tx = db.transaction("settings", "readwrite");
    tx.objectStore("settings").put(id, "selectedVideo");
}

async function getSelectedVideoId() {
    const db = await openDB();
    const tx = db.transaction("settings", "readonly");
    return new Promise(resolve => {
        const req = tx.objectStore("settings").get("selectedVideo");
        req.onsuccess = () => resolve(req.result);
    });
}

async function selectVideo(video) {
    const videoElement = document.getElementById("bg-video");

    videoElement.src =
        video.type === "user"
            ? URL.createObjectURL(video.videoSrc)
            : video.videoSrc;

    await setSelectedVideo(video.id);
    renderVideoGallery();
}

videoInput.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;

    const video = await saveUserVideo(file);
    await selectVideo(video);
});

insertPresetVideosOnce().then(async () => {
    await renderVideoGallery();
});

getSelectedVideoId().then(async (selectedId) => {
    const videos = await loadAllVideos();
    if (selectedId) {
        const video = videos.find(v => v.id === selectedId);
        if (video) selectVideo(video);
    }
    else {
        // pick first preset, fallback to first item
        const defaultVideo =
            videos.find(v => v.type === "preset") || videos[0];

        if (!defaultVideo) return;
        selectVideo(defaultVideo);
    }
});