const {JSDOM} = require('jsdom')

async function crawlPage(baseUrl, currentURL, pages) {
    
    const baseUrlObj = new URL(baseUrl)
    const currentURLObj = new URL(currentURL)
    if (baseUrlObj.hostname != currentURLObj.hostname) {
        return pages
    } 

    const normalizeCurrentUrl = normalizeUrl(currentURL)
    if (pages[normalizeCurrentUrl] > 0) {
        pages[normalizeCurrentUrl]++
        return pages
    }
    
    pages[normalizeCurrentUrl] = 1
    
    console.log(`crawling ${currentURL}`)
    
    try {
    const resp = await fetch(currentURL)
    
    if (resp.status > 399) {
        console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
        return
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
        console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
        return pages
    }
    
    const htmlBody = await resp.text()

    nextURLS = getUrlsFromHTML(htmlBody, baseUrl)

    for (const nextURl of nextURLS) {
        pages = await crawlPage(baseUrl, nextURl, pages)
    }
    } catch(err) {
        console.log(`error in fetch: ${err.meesage}, on page: ${currentURL}`)
    }
    return pages
}

function getUrlsFromHTML(htmlBody, baseUrl) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) == '/') {
        //relative
            try {
            const urlObj = new URL(`${baseUrl}${linkElement.href}`)
            urls.push(urlObj.href)
        } catch(err){
            console.log(`error with relative url: ${err.message}`)
        }
        } else {
        // absolute
            try {
        const urlObj = new URL(linkElement.href)    
        urls.push(urlObj.href)
        }  catch(err) {
            console.log(`error with absolute url: ${err.message}`)

        }  
        }
    }
    return urls
}

function normalizeUrl(urlString) {
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostpath.length > 0 && hostpath.slice(-1) == '/') {
        return hostpath.slice(0, -1)
    }
    return hostpath
} 

module.exports = {
    normalizeUrl,
    getUrlsFromHTML,
    crawlPage
}