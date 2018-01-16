const keytar = require( 'keytar' );
const jwtDecode = require( 'jwt-decode' );

// Config
const SERVICE = 'vip-go-cli';

class Token {
	constructor( token ) {
		const t = jwtDecode( token );
		this.raw = token;
		this.id = t.id;
		this.iat = new Date( t.iat * 1000 );
		this.exp = new Date( t.exp * 1000 );
	}

	valid() {
		const now = new Date();
		return now > this.iat && now < this.exp;
	}

	expired() {
		const now = new Date();
		return now > this.exp;
	}
}

module.exports = Token;

module.exports.set = function( token ) {
	return keytar.setPassword( SERVICE, SERVICE, token );
};

module.exports.get = async function() {
	const token = await keytar.getPassword( SERVICE, SERVICE );
	try {
		return new Token( token );
	} catch ( e ) {
		return null;
	}
};

module.exports.purge = async function() {
	const credentials = await keytar.findCredentials( SERVICE );
	credentials.forEach( c => keytar.deletePassword( SERVICE, c.account ) );
};