var player;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('player', {
    height: '1',
    width: '1',
    videoId: '',
    playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
    events: {
      onReady: function () {
        console.log('Player ready');
        window.parent.postMessage({ type: 'ready' }, '*');
        setInterval(function () {
          if (!player || !player.getCurrentTime) return;
          window.parent.postMessage({
            type: 'progress',
            current: player.getCurrentTime() || 0,
            duration: player.getDuration() || 0,
          }, '*');
        }, 500);
      },
      onStateChange: function (e) {
        var map = {
          '-1': 'unstarted',
          '0': 'ended',
          '1': 'playing',
          '2': 'paused',
          '3': 'buffering',
          '5': 'cued'
        };

        window.parent.postMessage({
          type: 'stateChange',
          state: map[String(e.data)]
        }, '*');
      },
      onError: function (e) {
        window.parent.postMessage({ type: 'error', code: e.data }, '*');
      },
    },
  });
}

window.addEventListener('message', function (e) {
  console.log(player);
  if (!player) return;
  var action = e.data.action;
  var videoId = e.data.videoId;
  var time = e.data.time;
  var volume = e.data.volume;
  if (action === 'load') player.loadVideoById(videoId);
  if (action === 'cue') player.cueVideoById(videoId);
  if (action === 'play') {
    console.log(player);
    player.playVideo();
  };
  if (action === 'pause') player.pauseVideo();
  if (action === 'seek') player.seekTo(time, true);
  if (action === 'setVolume') player.setVolume(volume);
});
