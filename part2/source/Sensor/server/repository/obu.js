function getOBUdata() {
	const data = [
		{
			// The identifier of a car. Any random string is fine, e.g. 65ac9720191a85b6842de0ec.
			// The value must be consistent with the "CAR_IDENTIFIER" in "OBU/.env" and the "NEXT_PUBLIC_CAR_IDENTIFIER" in "Frontend/.env"
			id: '65ac9720191a85b6842de0ec',
			port: '12344',
			name: 'car01',
		},
	];
	return data;
}

module.exports = {
	getOBUdata,
};
