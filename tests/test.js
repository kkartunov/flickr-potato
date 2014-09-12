casper.test.begin('Flickr Potato App tests', function (test) {
    casper.start('http://localhost:8000', function () {

        test.assertHttpStatus(200, 'Webserver is up, running and responds');

        test.assertTitle('Flickr - potato');

        test.assertExists('.page-header h1  small', 'Prints version in title');

        test.assertEvalEquals(function () {
            return __utils__.findOne('.page-header h1  small').textContent;
        }, '0.1.0', 'Sets the correct version # in title');

        casper.waitForSelector('.feed-item', function () {

            test.pass('E2E Tests wait for Angular and feed results');

            test.assertEvalEquals(function () {
                return __utils__.findOne('.breadcrumb .badge').textContent;
            }, '20', 'Results List has length index 20 in breadcrump');
        });
    });

    casper.run(function () {
        test.done();
    });
});
