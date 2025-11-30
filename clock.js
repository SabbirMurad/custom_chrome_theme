const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    // const s = String(now.getSeconds()).padStart(2, '0');
    const day = now.getDay();

    document.getElementById("clock").textContent = `${h == 0 ? 12 : h > 12 ? h - 12 : h}:${m} ${h > 12 ? 'PM' : 'AM'}`;
    document.getElementById("date").textContent = `${days[day]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setInterval(updateClock, 1000 * 60);
updateClock();