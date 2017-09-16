 const passcode = require('deep-passcode')

const http = require('http')

module.exports = function (targetUrl) {
  if (!passcode) {
    console.log('Cannot create Deep passcode')
    console.log('Cannot start Deep proxy')
    process.exit(1)
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Deep: sharing across devices</title>
    <link href="http://deep.io/assets/global.css" rel="stylesheet" />
    <link href="http://deep.io/assets/favicon.ico" rel="icon" type="image/png" />
    <script>
      document.firstElementChild.style.display = 'none'
    </script>
  </head>
  <body>
    <main>
      <h1 class="hide">Deep</h1>
      <noscript>
        <p>Deep normally relies on JavaScript to ensure redirection works smoothly.</p>
        <p>You can try a JavaScript-free <a href="${targetUrl}">redirect</a>, but we can't catch you if it fails.</p>
      </noscript>
      <div class="message"></div>
      <svg id="logo" version="1.1" viewBox="0 0 225 68" xmlns="http://www.w3.org/2000/svg">
        <g fill="#000000" id="5" transform="translate(-151.000000, -150.000000)">
          <g id="Group" transform="translate(146.000000, 127.000000)">
            <path d="M5.0234375,23.359375 L33.9453125,23.359375 C54.4765625,23.359375 66.5234375,35.03125 66.5234375,56.6875 C66.5234375,78.34375 54.4296875,91 33.9453125,91 L5.0234375,91 L5.0234375,23.359375 Z M24.8984375,39.15625 L24.8984375,75.203125 L31.1328125,75.203125 C41.0703125,75.203125 46.2734375,69.15625 46.2734375,56.6875 C46.2734375,45.296875 40.6484375,39.15625 31.1328125,39.15625 L24.8984375,39.15625 Z M116.976562,75.203125 L89.1328125,75.203125 L89.1328125,64.328125 L115.242188,64.328125 L115.242188,50.078125 L89.1328125,50.078125 L89.1328125,39.15625 L116.976562,39.15625 L116.976562,23.359375 L69.2578125,23.359375 L69.2578125,91 L116.976562,91 L116.976562,75.203125 Z M168.976562,75.203125 L141.132812,75.203125 L141.132812,64.328125 L167.242187,64.328125 L167.242187,50.078125 L141.132812,50.078125 L141.132812,39.15625 L168.976562,39.15625 L168.976562,23.359375 L121.257812,23.359375 L121.257812,91 L168.976562,91 L168.976562,75.203125 Z M173.257812,23.359375 L204.148437,23.359375 C219.195312,23.359375 229.320312,32.96875 229.320312,48.015625 C229.320312,62.921875 218.585937,72.53125 202.789062,72.53125 L193.132812,72.53125 L193.132812,91 L173.257812,91 L173.257812,23.359375 Z M193.132812,38.3125 L193.132812,57.859375 L198.710937,57.859375 C205.320312,57.859375 209.257812,54.53125 209.257812,48.0625 C209.257812,41.640625 205.320312,38.3125 198.851562,38.3125 L193.132812,38.3125 Z"></path>
          </g>
        </g>
      </svg>
    </main>
    <svg id="cut" preserveAspectRatio="none" version="1.1" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <linearGradient gradientUnits="userSpaceOnUse" id="gradient" x1="0" x2="0%" y1="0" y2="1000">
        <stop offset="0%" stop-color="#48A0FE" />
        <stop offset="100%" stop-color="#033385" />
      </linearGradient>
      <polygon fill="url(#gradient)" x="0" y="0" points="0 1000 0 0 1000 0"></polygon>
    </svg>
    <script>
      var targetUrl = '${targetUrl}'
      var xhr = new XMLHttpRequest()

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (/:12345/.test(targetUrl)) {
            document.location = targetUrl
          } else if ((xhr.status === 200 || xhr.status === 204)) {
            document.location = targetUrl
          }
        }
      }

      xhr.open("GET", targetUrl, true)
      xhr.send()

      window.setTimeout(function () {
        insertMessage()
      }, 1000)

      function insertMessage () {
        var messageEl = document.querySelector('.message')
        var messageFrag = document.createDocumentFragment()
        var messageTitle = messageFrag.appendChild(document.createElement('p'))
        var messageContent = messageFrag.appendChild(document.createElement('p'))
        var messageMore = messageFrag.appendChild(document.createElement('p'))

        messageTitle.classList.add('intro')
        messageTitle.innerText = 'Target not found'
        messageContent.innerText = 'There appears to be a problem with the proxy on the host device.'
        messageMore.innerHTML = 'For more information, please visit our <a href="http://deep.io/help#targetnotfound">help</a> page.'
        messageEl.appendChild(messageFrag)
        document.firstElementChild.style.display = 'block'
      }
    </script>
  </body>
</html>`

  http.createServer((req, res) => {
    res.writeHead(200, {
      'Access-Control-Allow-Headers': 'cache-control, content-type, expires, location, origin, pragma, x-http-method-override, x-requested-with',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Cache-Control': 'must-revalidate, no-cache, no-store, private',
      'Expires': '-1',
      'Pragma': 'no-cache'
    })
    res.end(html)
  }).listen(54321, '0.0.0.0', () => {
    console.log(`\u2693 deep.io/${passcode} \u2192 ${targetUrl}`)
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Cannot start Deep proxy (port 54321 is already in use)')
    }
    process.exit(1)
  })

  return `${passcode}`
}
