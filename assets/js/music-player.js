(function () {
  'use strict';

  const STORAGE_KEY = 'musicPlayerData';

  class MusicPlayer {
    constructor() {
      this.playlist = [];
      this.currentIndex = -1;
      this.isPlaying = false;
      this.duration = 0;
      this.currentTime = 0;
      this.volume = 80;
      this.ytTabId = null;

      this._loadStorage();
      this._createDOM();
      this._bindEvents();
      this._listenForTabMessages();
      this._renderPlaylist();
      this._updateNowPlaying();
    }

    // ── Storage ───────────────────────────────────────────────────────────────

    _loadStorage() {
      try {
        const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        this.playlist = d.playlist || [];
        this.currentIndex = d.currentIndex ?? -1;
        this.volume = d.volume ?? 80;
      } catch (_) {}
    }

    _saveStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        playlist: this.playlist,
        currentIndex: this.currentIndex,
        volume: this.volume,
      }));
    }

    // ── YouTube tab control ───────────────────────────────────────────────────

    _openYouTubeTab(videoId) {
      const open = () => {
        chrome.tabs.create(
          { url: `https://www.youtube.com/embed/${videoId}?autoplay=1`, active: false },
          (tab) => { this.ytTabId = tab.id; }
        );
      };

      if (this.ytTabId != null) {
        chrome.tabs.remove(this.ytTabId, () => {
          this.ytTabId = null;
          open();
        });
      } else {
        open();
      }

      this.isPlaying = false;
      this._updatePlayPauseBtn();
    }

    _sendToTab(msg) {
      if (this.ytTabId == null) return;
      chrome.tabs.sendMessage(this.ytTabId, msg).catch(() => {});
    }

    _listenForTabMessages() {
      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (!msg || msg.type !== 'ytState') return;
        if (sender.tab?.id !== this.ytTabId) return;

        this.isPlaying = msg.isPlaying;
        this.currentTime = msg.currentTime;
        this.duration = msg.duration;
        this._updatePlayPauseBtn();
        this._updateProgress();

        if (msg.ended) this._next();
      });
    }

    // ── DOM ───────────────────────────────────────────────────────────────────

    _createDOM() {
      const root = document.createElement('div');
      root.id = 'mp-root';
      root.innerHTML = this._html();
      document.getElementById('foreground').appendChild(root);

      this.$ = {
        toggleBtn:    document.getElementById('mp-toggle-btn'),
        panel:        document.getElementById('mp-panel'),
        thumbnail:    document.getElementById('mp-thumbnail'),
        title:        document.getElementById('mp-title'),
        seek:         document.getElementById('mp-seek'),
        currentTime:  document.getElementById('mp-current-time'),
        durationEl:   document.getElementById('mp-duration'),
        playPauseBtn: document.getElementById('mp-play-pause'),
        playIcon:     document.getElementById('mp-play-icon'),
        pauseIcon:    document.getElementById('mp-pause-icon'),
        prevBtn:      document.getElementById('mp-prev'),
        nextBtn:      document.getElementById('mp-next'),
        volumeSlider: document.getElementById('mp-volume'),
        urlInput:     document.getElementById('mp-url-input'),
        addBtn:       document.getElementById('mp-add-btn'),
        playlist:     document.getElementById('mp-playlist'),
        errorMsg:     document.getElementById('mp-error'),
      };

      this.$.volumeSlider.value = this.volume;
      this._updateVolumeTrack();
    }

    _html() {
      return `
        <button id="mp-toggle-btn" class="glass-card" title="Music Player">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </button>

        <div id="mp-panel" class="glass-card mp-closed">
          <div class="mp-header">
            <span class="mp-header-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              Music
            </span>
            <button class="mp-icon-btn" id="mp-close-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="mp-now-playing">
            <img id="mp-thumbnail" src="" alt="" class="mp-thumb mp-thumb-hidden">
            <p id="mp-title" class="mp-title">No track selected</p>
          </div>

          <div class="mp-progress-section">
            <input type="range" id="mp-seek" class="mp-range" min="0" max="100" value="0" step="0.1">
            <div class="mp-time-row">
              <span id="mp-current-time">0:00</span>
              <span id="mp-duration">0:00</span>
            </div>
          </div>

          <div class="mp-controls">
            <button id="mp-prev" class="mp-ctrl-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="2" height="16"/>
              </svg>
            </button>
            <button id="mp-play-pause" class="mp-ctrl-btn mp-play-btn">
              <svg id="mp-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg id="mp-pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mp-hidden">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
            <button id="mp-next" class="mp-ctrl-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20 5 4"/><rect x="17" y="4" width="2" height="16"/>
              </svg>
            </button>
          </div>

          <div class="mp-volume-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
            <input type="range" id="mp-volume" class="mp-range mp-volume-range" min="0" max="100" value="80">
          </div>

          <div class="mp-add-row">
            <input type="text" id="mp-url-input" placeholder="Paste YouTube URL..." autocomplete="off">
            <button id="mp-add-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>

          <p id="mp-error" class="mp-error"></p>
          <div id="mp-playlist" class="mp-playlist"></div>
        </div>
      `;
    }

    _bindEvents() {
      const $ = this.$;

      $.toggleBtn.addEventListener('click', () => $.panel.classList.toggle('mp-closed'));
      document.getElementById('mp-close-btn').addEventListener('click', () => $.panel.classList.add('mp-closed'));

      $.playPauseBtn.addEventListener('click', () => this._togglePlay());
      $.prevBtn.addEventListener('click', () => this._prev());
      $.nextBtn.addEventListener('click', () => this._next());

      $.seek.addEventListener('input', () => {
        const time = (parseFloat($.seek.value) / 100) * this.duration;
        this._sendToTab({ action: 'seek', time });
        this._updateSeekTrack();
      });

      $.volumeSlider.addEventListener('input', () => {
        this.volume = parseInt($.volumeSlider.value);
        this._sendToTab({ action: 'volume', volume: this.volume });
        this._updateVolumeTrack();
        this._saveStorage();
      });

      $.addBtn.addEventListener('click', () => this._addFromInput());
      $.urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._addFromInput();
        e.stopPropagation();
      });
      $.panel.addEventListener('keydown', (e) => e.stopPropagation());
      $.panel.addEventListener('keyup',  (e) => e.stopPropagation());
    }

    // ── Playlist ──────────────────────────────────────────────────────────────

    async _addFromInput() {
      const url = this.$.urlInput.value.trim();
      if (!url) return;

      const videoId = this._extractVideoId(url);
      if (!videoId) { this._showError('Invalid YouTube URL'); return; }
      if (this.playlist.find(t => t.id === videoId)) { this._showError('Already in playlist'); return; }

      this._hideError();
      this.$.urlInput.value = '';

      const track = { id: videoId, title: 'Loading...', thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` };
      this.playlist.push(track);
      const addedIndex = this.playlist.length - 1;
      this._renderPlaylist();
      this._saveStorage();

      if (this.playlist.length === 1) this._loadTrack(0);

      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        const data = await res.json();
        track.title = data.title || `Track ${videoId}`;
      } catch (_) {
        track.title = `Track ${videoId}`;
      }
      this._renderPlaylist();
      this._saveStorage();
      if (this.currentIndex === addedIndex) this._updateNowPlaying();
    }

    _loadTrack(index) {
      if (index < 0 || index >= this.playlist.length) return;
      this.currentIndex = index;
      this._saveStorage();
      this._updateNowPlaying();
      this._highlightCurrentTrack();
      this._openYouTubeTab(this.playlist[index].id);
    }

    _togglePlay() {
      if (this.currentIndex < 0 && this.playlist.length > 0) { this._loadTrack(0); return; }
      if (this.currentIndex >= 0 && this.ytTabId == null) { this._loadTrack(this.currentIndex); return; }
      this._sendToTab({ action: this.isPlaying ? 'pause' : 'play' });
    }

    _prev() {
      if (!this.playlist.length) return;
      this._loadTrack(this.currentIndex <= 0 ? this.playlist.length - 1 : this.currentIndex - 1);
    }

    _next() {
      if (!this.playlist.length) return;
      this._loadTrack((this.currentIndex + 1) % this.playlist.length);
    }

    _removeTrack(index) {
      this.playlist.splice(index, 1);
      if (this.playlist.length === 0) {
        this.currentIndex = -1;
        if (this.ytTabId != null) { chrome.tabs.remove(this.ytTabId).catch(() => {}); this.ytTabId = null; }
        this.isPlaying = false;
        this._updateNowPlaying();
        this._updatePlayPauseBtn();
      } else if (index === this.currentIndex) {
        this.currentIndex = Math.min(index, this.playlist.length - 1);
        this._loadTrack(this.currentIndex);
      } else if (index < this.currentIndex) {
        this.currentIndex--;
      }
      this._renderPlaylist();
      this._saveStorage();
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    _updateProgress() {
      const pct = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
      this.$.seek.value = pct;
      this.$.currentTime.textContent = this._fmt(this.currentTime);
      this.$.durationEl.textContent  = this._fmt(this.duration);
      this._updateSeekTrack();
    }

    _updateSeekTrack()   { this.$.seek.style.setProperty('--p', `${this.$.seek.value}%`); }
    _updateVolumeTrack() { this.$.volumeSlider.style.setProperty('--p', `${this.$.volumeSlider.value}%`); }

    _updatePlayPauseBtn() {
      this.$.playIcon.classList.toggle('mp-hidden', this.isPlaying);
      this.$.pauseIcon.classList.toggle('mp-hidden', !this.isPlaying);
    }

    _updateNowPlaying() {
      if (this.currentIndex >= 0 && this.playlist[this.currentIndex]) {
        const t = this.playlist[this.currentIndex];
        this.$.title.textContent = t.title;
        this.$.thumbnail.src = t.thumbnail;
        this.$.thumbnail.classList.remove('mp-thumb-hidden');
      } else {
        this.$.title.textContent = 'No track selected';
        this.$.thumbnail.classList.add('mp-thumb-hidden');
      }
    }

    _renderPlaylist() {
      const c = this.$.playlist;
      c.innerHTML = '';
      this.playlist.forEach((track, i) => {
        const el = document.createElement('div');
        el.className = `mp-track${i === this.currentIndex ? ' mp-track-active' : ''}`;
        el.innerHTML = `
          <img src="${track.thumbnail}" alt="" onerror="this.style.visibility='hidden'">
          <span>${this._esc(track.title)}</span>
          <button class="mp-remove" data-i="${i}">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>`;
        el.addEventListener('click', (e) => { if (!e.target.closest('.mp-remove')) this._loadTrack(i); });
        el.querySelector('.mp-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          this._removeTrack(parseInt(e.currentTarget.dataset.i));
        });
        c.appendChild(el);
      });
    }

    _highlightCurrentTrack() {
      document.querySelectorAll('#mp-playlist .mp-track').forEach((el, i) => {
        el.classList.toggle('mp-track-active', i === this.currentIndex);
      });
    }

    _showError(msg) {
      this.$.errorMsg.textContent = msg;
      clearTimeout(this._errTimer);
      this._errTimer = setTimeout(() => { this.$.errorMsg.textContent = ''; }, 3000);
    }

    _hideError() { this.$.errorMsg.textContent = ''; }

    _extractVideoId(url) {
      const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      return m ? m[1] : null;
    }

    _fmt(s) {
      s = Math.floor(s) || 0;
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }

    _esc(str) {
      const d = document.createElement('div');
      d.appendChild(document.createTextNode(str));
      return d.innerHTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MusicPlayer());
  } else {
    new MusicPlayer();
  }
})();
