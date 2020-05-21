const puppeteer = require('puppeteer');

module.exports = function(app) {

    app.get('/upload', function(req, res) {

        console.log(req.query);
        const ip = req.query.ip;

        (async () => {
            const browser = await puppeteer.launch({
                headless: false,
                devtools: false,
                ignoreHTTPSErrors: true
            });

            const page = await browser.newPage();

            page.on('dialog', async dialog => {
                console.log(dialog.message());
                await dialog.accept();
                res.status(200).send('carga ok');
		        //await browser.close();
            });

            try {

                await page.goto('http://' + ip)

                try {

                    await page.waitForSelector('#hg_logo');
                    const element = await page.$("#hg_logo");
                    const model = await page.evaluate(element => element.textContent, element);
                    console.log("model :" + model);

                } catch (e) {

                    console.log("model : no se");
                }

                await page.type('#txt_Username', 'telecomadmin')
                await page.type('#txt_Password', 'admintelecom')
                await page.click('[name="Submit"]')
                await page.waitForNavigation()
                await page.click('[name="maindiv_reset"]') 
                await page.waitForSelector('[name="subdiv_cfgfile"]');
                await page.click('[name="subdiv_cfgfile"]') 

                await page.waitForSelector('#frameContent');
                const selector = '[name="btnSubmit"]';
                const Frame = await page.frames()[1]; 
                await page.waitFor(3000);

                const elementHandle = await Frame.$("input[type=file]");

                await elementHandle.uploadFile('./config.xml');
                await Frame.$eval(selector, el => el.click());
                await page.waitForSelector('#UploadInfo');

            } catch (e) {
                console.log('Algo salio mal\n' + e.message);
                res.sendStatus(500);
		        //await browser.close();
            }

        })();

    });

}