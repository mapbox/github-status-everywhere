// Saves options to chrome.storage
function save_options() {
  var token = document.getElementById('token').value;
  chrome.storage.sync.set({
    token: token
  }, function() {
    document.getElementById('token').innerHTML = 'saved';
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    token: ''
  }, function(items) {
    document.getElementById('token').value = items.token;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
