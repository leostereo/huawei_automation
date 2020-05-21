const puppeteer = require('puppeteer');

module.exports = function(app) {

    app.get('/set_userid', function(req, res) {

        const ip = req.query.ip;
        const uid = req.query.uid;
        console.log("set_userid ip: "+req.query.ip+" uid: "+req.query.uid);

        (async () => {
            const browser = await puppeteer.launch({
                headless: false,
                devtools: false,
                ignoreHTTPSErrors: true
            });
            const page = await browser.newPage();

            try {

                await page.goto('http://'+ip+':80')

                try {

                    await page.waitForSelector('#hg_logo');
                    const element = await page.$("#hg_logo");
                    const model = await page.evaluate(element => element.textContent, element);
                    console.log("model :" + model);

                } catch (e) {

                    console.log("model : unknown closing browser");
		    await browser.close();
                }


                await page.waitForSelector('#txt_Username');
                await page.type('#txt_Username', 'adminwiber')
                await page.type('#txt_Password', 'wiberpass123')
                await page.click('[name="Submit"]')
                await page.waitForNavigation()
                await page.waitForSelector('[name="maindiv_wan"]');
                await page.click('[name="maindiv_wan"]')
                await page.waitForSelector('[name="subdiv_wan"]');
                await page.click('[name="subdiv_wan"]')

                await page.waitForSelector('#frameContent');
                const wan_selector = '#wanInstTable_0_1';
                const Frame = await page.frames()[1];
                await Frame.waitFor(wan_selector);
                await Frame.click(wan_selector);
                await Frame.waitFor('#IPv4ClientId');
                await Frame.evaluate( () => document.getElementById("IPv4ClientId").value = "")
                await Frame.type('#IPv4ClientId',uid);
                await Frame.click('#ButtonApply');
		let exit_msg = "user id changed successfully"; 
		res.status(200).send(exit_msg);                
		console.log(exit_msg);


            } catch (e) {
                console.log('Algo salio mal\n' + e.message);
                res.sendStatus(500);
		await browser.close();
            }


        })();

    });

}
