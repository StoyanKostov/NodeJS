var _ = require('argparse/node_modules/underscore/underscore.js');
function generateUniqeKey(){
	var  chirpIdChars = [];
	for (var i = 0; i < 26; i++) {
		chirpIdChars[i] = String.fromCharCode(i + 65);
		chirpIdChars[i+26] = String.fromCharCode(i + 97);
	};
	return (_.shuffle(chirpIdChars).slice(0, 3)).join('');
}

var foo = generateUniqeKey();

function writeToChirpDB( act, userName, chirpText){
	if (!chirpDB.hasOwnProperty(userName) && act == 'register') {
		var currChirpsIndex = {};
		chirpDB[userName] = {};
		chirpDB[userName].chirps = [];
		currChirpsIndex.userId = generateUniqeKey();

		if (chirpText != undefiend) {
			currChirpsIndex.chirpId = generateUniqeKey();
			currChirpsIndex.chirpText = chirpText;
			currChirpsIndex.chirpTime = new Date();
			chirpDB[userName].chirps.unshift(currChirpsIndex);
		};
	}
	else{
		return 409;
	};
}