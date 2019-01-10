// Type your JavaScript code here.

function notifyMe(title, body) {
  var options = {
      body,
      silent: true,
  };
  if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
  }

  else if (Notification.permission === "granted") {
      var notification = new Notification(title, options);
  }

  else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
          if (permission === "granted") {
              var notification = new Notification(title, options);
          }
      });
  }
}

var $ = jQuery.noConflict();
$('body').on('click', '.attachment', function() {
  let $temp = $('<input>');
  $('body').append($temp);
  let url = $('.setting[data-setting=url] input').val().match(/\/wp-content\/.*/);
  $temp.val(url).select();
  document.execCommand('copy');
  $temp.remove();
  // notifyMe('Copied', url);
  console.log(`Copied: ${url}`)
});