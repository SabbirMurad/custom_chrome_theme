chrome.runtime.onInstalled.addListener(setupYouTubeRule);
chrome.runtime.onStartup.addListener(setupYouTubeRule);

async function setupYouTubeRule() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1001],
      addRules: [{
        id: 1001,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'Referer', operation: 'set', value: 'https://www.youtube.com/' }
          ]
        },
        condition: {
          urlFilter: '*youtube-nocookie.com/embed/*',
          resourceTypes: ['sub_frame']
        }
      }]
    });
    console.log('[SW] YouTube Referer rule set up');
  } catch (e) {
    console.error('[SW] Failed to set up rule:', e);
  }
}
