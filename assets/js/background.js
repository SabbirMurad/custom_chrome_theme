const DB_NAME = "themeDB";
const STORE_NAME = "videos";
const VIDEO_KEY = "backgroundVideo";

// Open DB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Save video file in DB
async function saveVideoToDB(file) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(file, VIDEO_KEY);
        tx.oncomplete = resolve;
        tx.onerror = reject;
    });
}

// Load video file from DB
async function loadVideoFromDB() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(VIDEO_KEY);

        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}

// Set video source (from file or default)
async function setBackgroundVideo() {
    const videoElement = document.getElementById("bg-video");
    const storedFile = await loadVideoFromDB();

    if (storedFile) {
        videoElement.src = URL.createObjectURL(storedFile);
    } else {
        // Default video if none is in the DB
        videoElement.src = "assets/video/confused-frieren.mp4";
    }
}

// Listen for file selection
const videoInput = document.querySelector("#settings-sidebar .video-selector #videoInput")

videoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await saveVideoToDB(file);
    setBackgroundVideo(); // instantly apply
});

// Load video on page load
setBackgroundVideo();
