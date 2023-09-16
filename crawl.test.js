const {normalizeUrl, getUrlsFromHTML} = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeUrl strip protocol', () => {
    const input = 'https:/blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeUrl capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeUrl strip http', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev">
            Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURl = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURl)
    const expected = ['https://blog.boot.dev/']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
            Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURl = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURl)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path1/">
            Boot.dev Blog
            </a>
            <a href="https://blog.boot.dev/path2/">
            Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURl = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURl)
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
            Invalid URL
            </a>
        </body>
    </html>
    `
    const inputBaseURl = "https://blog.boot.dev"
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURl)
    const expected = []
    expect(actual).toEqual(expected)
})