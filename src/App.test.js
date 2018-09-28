const puppeteer = require('puppeteer');
const faker = require('faker');
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
}


const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo: 50,
    devtools: false
  }
  // console.log(process.env.NODE_ENV);
  return debugging_mode;
  // if (process.env.NODE_ENV === "debug") {
  //   console.log('In the block. I am debug');
  //   return debugging_mode;
  // } else {
  //   console.log('In the block. I am NOT in debug');
  //    return {}
  //  }
}
let browser
let page
let logs = []
let errors = []
beforeAll(async () => {
  // console.log('Before All');
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.setRequestInterception(true)

  page.on('request', interceptedRequest => {
  
   

    if (interceptedRequest._url.includes('swapi')) {

    // interceptedRequest.abort()
     interceptedRequest.continue()

    } else {
     // console.log( interceptedRequest._url);
     interceptedRequest.continue()

    }

  })
  page.on('console', c => {
    logs.push(c._text);
  })

  page.on('pageerror', e => errors.push(e.text))

  await page.goto('http://localhost:3000');
  await page.emulate(iPhone)
  //page.setViewport({
  //  width: 500,
  //  height: 2400
  //})

})

describe('on page load', () => {
  test('h1 loads correctly', async () => {



    const html = await page.$eval('[data-testid="h1"]', e => e.innerHTML);
    expect(html).toBe('Welcome to React');


  }, 16000);

  test.skip('nav loads correctly', async () => {
    const navbar = await page.$eval('[data-testid="navbar"]', el => el ? true : false);
    const listItems = await page.$$('[data-testid="navBarLi"]');
    expect(navbar).toBe(true);
   // await page.screenshot({
    //   path: 'testScreenshot.png',
     // fullPage: bool,
     //quality: 0 - 100,
     //clip: {}
    // });
    // await page.pdf({
    //   path: 'screenshot.png',
    //   scale: number,
    //  format: string,
    // margin: object
    //})
    expect(listItems.length).toBe(4);


  })

  //test('login form works correctly', async ()=>{

  //await page.click('[data-testid="firstName"]');
  //await page.type('[data-testid="firstName"]', user.firstName);

  //  await page.click('[data-testid="lastName"]');
  // await page.type('[data-testid="lastName"]', user.lastName);

  // await page.click('[data-testid="email"]');
  //  await page.type('[data-testid="email"]', user.email);

  // await page.click('[data-testid="password"]');
  // await page.type('[data-testid="password"]', user.password);


  // await page.click('[data-testid="submit"]')

  //  await page.waitForSelector('[data-testid="success"]')

  // },40000);
  describe('login form', () => {
    test.skip('lfill form and submint', async () => {
      // const page2 = await browser.newPage();
      // await page2.emulate(iPhone);

      // await page2.goto('http://localhost:3000');
      await page.setCookie({ name: 'JWT', value: 'asdfasdfa' });




      const firstName = await page.$('[data-testid="firstName"]')
      const lastName = await page.$('[data-testid="lastName"]');
      const email = await page.$('[data-testid="email"]');
      const password = await page.$('[data-testid="password"]');
      const submit = await page.$('[data-testid="submit"]');

      await firstName.tap()
      await page.type('[data-testid="firstName"]', user.firstName);

      await lastName.tap()
      await page.type('[data-testid="lastName"]', user.lastName);

      await email.tap()
      await page.type('[data-testid="email"]', user.email);

      await password.tap()
      await page.type('[data-testid="password"]', user.password);


      await submit.tap()

      await page.waitForSelector('[data-testid="success"]')

    }, 16000)
    test.skip('sets firstName cookie', async () => {
      const cookies = await page.cookies()
      const firstNameCookie = cookies.find(c => c.name === 'firstName' && c.value === user.firstName)

      expect(firstNameCookie).not.toBeUndefined()


    })
    test.skip('does not have console logs', () => {
      const newLogs = logs.filter(s => (
        s !== '%cDownload the React DevTools for a better development experience: https://fb.me/react-devtools font-weight:bold' &&
        s.match(/failed: WebSocket is closed before the connection is established./) == 0
      )
      )
      //logs.forEach(s=>console.log(s))


      expect(newLogs.length).toBe(0)

    })

    test('does not have exceptions', () => {

      expect(errors.length).toBe(0)

    })

  })

  test.skip('fails to fetch starwars endpoint', async () => {
    const h3 = await page.$eval('[data-testid="starWars"]', e => e.innerHTML)
    expect(h3).toBe('Received StarWars data!')
  })

});
afterAll(() => {

  isDebugging() ? browser.close() : {}
})
