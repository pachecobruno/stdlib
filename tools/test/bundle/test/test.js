'use strict';

// MODULES //

var tape = require( 'tape' );
var join = require( 'path' ).join;
var unlink = require( 'fs' ).unlinkSync;
var readFile = require( '@stdlib/fs/read-file' ).sync;
var noop = require( '@stdlib/utils/noop' );
var bundle = require( './../lib' );


// FIXTURES //

var EXPECTED = readFile( join( __dirname, 'fixtures', 'expected.txt' ) );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof bundle, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function throws an error if the first argument is not a string primitive', function test( t ) {
	var values;
	var i;
	values = [
		5,
		NaN,
		null,
		void 0,
		true,
		{},
		[],
		function noop() {}
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided '+values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			bundle( value, noop );
		};
	}
});

tape( 'the function throws an error if the last argument is not a callback function', function test( t ) {
	var values;
	var i;
	values = [
		5,
		'abc',
		NaN,
		null,
		void 0,
		true,
		{},
		[]
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided '+values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			var dir = join( __dirname, 'fixtures' );
			bundle( dir, value );
		};
	}
});

tape( 'the function throws an error if the last argument is not a callback function (options)', function test( t ) {
	var values;
	var i;
	values = [
		5,
		'abc',
		NaN,
		null,
		void 0,
		true,
		{},
		[]
	];

	for ( i = 0; i < values.length; i++ ) {
		t.throws( badValue( values[i] ), TypeError, 'throws a type error when provided '+values[i] );
	}
	t.end();

	function badValue( value ) {
		return function badValue() {
			var dir = join( __dirname, 'fixtures' );
			var opts = {};
			bundle( dir, opts, value );
		};
	}
});

tape( 'the function creates a test bundle using `browserify` and calls the callback with the generated output', function test( t ) {
	var dir = join( __dirname, 'fixtures' );
	var opts = {
		'pattern': 'index.js'
	};
	bundle( dir, opts, onRead );

	function onRead( error, output ) {
		if ( error ) {
			t.ok( false, 'did not expect an error' );
		}
		t.deepEqual( output, EXPECTED, 'returns bundled code' );
		t.end();
	}
});

tape( 'the function creates a test bundle using `browserify` and writes the results to disk', function test( t ) {
	var dir = join( __dirname, 'fixtures' );
	var opath = join( __dirname, 'fixtures', 'bundle.js' );
	var opts = {
		'out': opath,
		'pattern': 'index.js'
	};
	bundle( dir, opts, onWrite );

	function onWrite( error, bool ) {
		var out;
		if ( error ) {
			t.ok( false, 'did not expect an error' );
		}
		t.ok( bool, 'returns true to indicate success' );
		out = readFile( opath );
		t.deepEqual( out, EXPECTED, 'written bundle contains expected contents' );

		// Remove created file:
		unlink( opath );
		t.end();
	}
});

tape( 'the function invokes the callback with an error if bundling fails', function test( t ) {
	var dir = join( __dirname, 'fixtures' );
	var opts = {
		'pattern': 'error.js'
	};
	bundle( dir, opts, onRead );

	function onRead( error ) {
		if ( error ) {
			t.ok( true, error.message );
		} else {
			t.ok( false, 'expected an error' );
		}
		t.end();
	}
});

tape( 'the function invokes the callback with an error if writing the bundle to disk fails', function test( t ) {
	var dir = join( __dirname, 'fixtures' );
	var opath = join( __dirname, 'fixtures', 'nonexisting', 'bundle.js' );
	var opts = {
		'out': opath,
		'pattern': 'index.js'
	};
	bundle( dir, opts, onWrite );

	function onWrite( error ) {
		if ( error ) {
			t.ok( true, error.message );
		} else {
			t.ok( false, 'expected an error' );
		}
		t.end();
	}
});