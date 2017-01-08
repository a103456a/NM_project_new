// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

'use strict'

let myNotification = new Notification('Title', {
    body: 'Lorem Ipsum Dolor Sit Amet'
})

myNotification.onclick = () => {
    console.log('Notification clicked')
}