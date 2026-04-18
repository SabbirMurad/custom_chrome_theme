let muted = false;
let loaded = false;

const PAGE_ORIGIN = location.origin;

function extractId(url) {
    try {
        const u = new URL(url.trim());
        if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || '';
    } catch { }
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
    return '';
}

function setStatus(msg, isError) {
    const el = document.getElementById('status');
    el.textContent = msg;
    el.className = 'status' + (isError ? ' error' : '');
}

function sendCmd(fn, args) {
    const frame = document.getElementById('ytFrame');
    if (!loaded) { setStatus('Load a video first.'); return; }
    frame.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: fn, args: args || [] }),
        'https://www.youtube.com'
    );
}

function loadVideo() {
    const url = document.getElementById('urlInput').value.trim();
    const id = extractId(url);

    if (!id) {
        setStatus("Couldn't find a video ID — check the URL and try again.", true);
        return;
    }

    const frame = document.getElementById('ytFrame');

    const embedUrl = 'https://www.youtube.com/embed/' + id
        + '?enablejsapi=1'
        + '&autoplay=1'
        + '&rel=0';

    frame.src = embedUrl;
    frame.style.display = 'block';
    document.getElementById('placeholder').style.display = 'none';

    muted = false;
    loaded = true;
    document.getElementById('btnMute').textContent = '🔇 Mute';
    setStatus('Video loaded.');
}

window.addEventListener('message', function (e) {
    if (e.origin !== 'https://www.youtube.com') return;
    try {
        const data = JSON.parse(e.data);
        if (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined) {
            const states = { '-1': 'Unstarted', '0': 'Ended', '1': 'Playing', '2': 'Paused', '3': 'Buffering', '5': 'Cued' };
            setStatus(states[data.info.playerState] || '');
        }
        if (data.event === 'onError') {
            const codes = {
                2: 'Invalid video ID.',
                5: 'HTML5 player error.',
                100: 'Video not found or is private.',
                101: 'Embedding disabled by the video owner.',
                150: 'Embedding disabled by the video owner.',
            };
            setStatus(codes[data.info] || 'Playback error (code ' + data.info + ').', true);
        }
    } catch { }
});

document.getElementById('btnLoad').addEventListener('click', loadVideo);

document.getElementById('urlInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') loadVideo();
});

document.getElementById('btnPlay').addEventListener('click', function () {
    sendCmd('playVideo');
});

document.getElementById('btnPause').addEventListener('click', function () {
    sendCmd('pauseVideo');
});

document.getElementById('btnStop').addEventListener('click', function () {
    sendCmd('stopVideo');
});

document.getElementById('btnMute').addEventListener('click', function () {
    if (!loaded) { setStatus('Load a video first.'); return; }
    muted = !muted;
    sendCmd(muted ? 'mute' : 'unMute');
    this.textContent = muted ? '🔊 Unmute' : '🔇 Mute';
});

document.getElementById('volSlider').addEventListener('input', function () {
    const v = parseInt(this.value);
    document.getElementById('volLabel').textContent = v;
    sendCmd('setVolume', [v]);
});