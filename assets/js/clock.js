const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const daysShort = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const analogHourHand = document.querySelector("#analog-clock-wrapper #hour");
const analogMinuteHand = document.querySelector("#analog-clock-wrapper #minute");
const analogSecondHand = document.querySelector("#analog-clock-wrapper #second");

const glowClockDate = document.querySelector("#digital-clock-v2-wrapper #glow-clock .date");
const glowClockTime = document.querySelector("#digital-clock-v2-wrapper #glow-clock .time");

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    // const s = String(now.getSeconds()).padStart(2, '0');
    const day = now.getDay();

    document.getElementById("clock").textContent = `${h == 0 ? 12 : h > 12 ? h - 12 : h}:${m} ${h > 12 ? 'PM' : 'AM'}`;
    document.getElementById("date").textContent = `${days[day]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    // Updating analog clock
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDeg = (seconds * 6);
    const minuteDeg = (minutes * 6 + seconds * 0.1);
    const hourDeg = ((hours % 12) * 30 + minutes * 0.5);

    analogSecondHand.style.transform = `rotate(${secondDeg}deg)`;
    analogMinuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    analogHourHand.style.transform = `rotate(${hourDeg}deg)`;

    // Updating digital v2
    glowClockDate.textContent = `${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()} - ${now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1} - ${now.getFullYear()} | ${daysShort[day]}`;

    let hour = h == 0 ? 12 : h > 12 ? h - 12 : h;
    glowClockTime.textContent = `${hour < 10 ? '0' + hour : hour} : ${m} : ${now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()} ${h > 12 ? 'PM' : 'AM'}`;
}

setInterval(updateClock, 1000);
updateClock();