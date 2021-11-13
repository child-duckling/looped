function offline() {
    console.log('%c **************************\n OFFLINE\n**************************', 'background: #222; color: #FF0000');
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
    });
}

var online = true
if (!navigator.onLine || Cookies.get('sl') === 'offline') {
    offline()
        /*
        PWA Mode
        */
    online = false //Don't want stuff getting cleared
}

window.addEventListener('offline', () => {
    offline()
    online = false
})

window.addEventListener('online', () => {
        online = true
        location.reload() //Will refresh cache if offline for more than 10 minutes
    })
    //768

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        return true
    } else {
        return false
    }
}

function mobileCollapse(p = null) {
    if (isMobile() && p || $(window).width() < 800) {
        return `data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"`
    } else {
        return ''
    }

}
//let loadedSize = window.innerWidth
//document.addEventListener("resize", () => {
//    if (loadedSize >= 800 && loadedSize >= window.innerWidth || loadedSize <= 800 && loadedSize <= window.innerWidth) window.location.reload()
//})
//window.addEventListener("resize", () => {
//    if (loadedSize >= 800 && loadedSize >= window.innerWidth || loadedSize <= 800 && loadedSize <= window.innerWidth) window.location.reload()
//})