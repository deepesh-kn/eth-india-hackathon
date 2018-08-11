var EIP20TokenMock = artifacts.require('./EIP20TokenMock.sol');

contract('EIP20TokenMock', function(accounts) {

    var token;
    var conversionRate = 1;
    var conversionRateDecimals = 1;
	var ost = 'OST';
	describe ('test', async () => {
		before(async () => {
            token = await EIP20TokenMock.new(conversionRate, conversionRateDecimals, ost, 'name', 18);
		});

	})
})
