const puppeteer = require('puppeteer');

module.exports = function(app) {

    app.get('/save', function(req, res) {

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
                const message = dialog.message();
                console.log("result :" + message);
                if (message === 'Configuration file saved successfully.') {
                    res.sendStatus(200);
                    await waitFor(2000);
		            await browser.close();
                } else {
                    res.sendStatus(500);
		    await browser.close();
                }
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


                await page.type('#txt_Username', 'adminwiber')
                await page.type('#txt_Password', 'wiberpass123')
                await page.click('[name="Submit"]')
                await page.waitForNavigation()
                await page.click('[name="maindiv_reset"]')
                await page.waitForSelector('[name="subdiv_cfgfile"]');
                await page.click('[name="subdiv_cfgfile"]')

                await page.waitForSelector('#frameContent');

                const selector = '[name="saveconfigbutton"]';
                const Frame = await page.frames()[1];
                await Frame.waitFor('[name="saveconfigbutton"]');
                await Frame.$eval(selector, el => el.click());

            } catch (e) {
                console.log('Algo salio mal\n' + e.message);
                res.sendStatus(500);
		await browser.close();
            }


        })();

    });

}