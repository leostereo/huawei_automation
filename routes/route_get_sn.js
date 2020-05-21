const puppeteer = require('puppeteer');

module.exports = function(app) {

    app.get('/get_sn', function(req, res) {

        console.log(req.query);
        const ip = req.query.ip;
        console.log("get_sn ip: ");


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

                    console.log("model : unknown");
                }


                await page.waitForSelector('#txt_Username');
                await page.type('#txt_Username', 'adminwiber')
                await page.type('#txt_Password', 'wiberpass123')
                await page.click('[name="Submit"]')
                await page.waitForNavigation()
                await page.waitForSelector('[name="maindiv_waninfo"]');
                await page.click('[name="maindiv_waninfo"]')
                await page.waitForSelector('[name="subdiv_deviceinfo"]');
                await page.click('[name="subdiv_deviceinfo"]')

                await page.waitForSelector('#frameContent');

                const sn_selector = '#td3_2';
                const Frame = await page.frames()[1];
                await Frame.waitFor(sn_selector);
                    const element = await Frame.$(sn_selector);
                    const sn = await Frame.evaluate(element => element.textContent, element);

   		    var regExp = /\(([^)]+)\)/;
		    var serial = regExp.exec(sn);		
                    console.log("sn :" +sn);
                    res.status(200).send(serial[1]);

            } catch (e) {
                console.log('Algo salio mal\n' + e.message);
                res.sendStatus(500);
		await browser.close();
            }


        })();

    });

}
