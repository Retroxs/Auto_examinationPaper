var async = require ( 'async' );
var officegen = require('officegen');

var fs = require('fs');
var path = require('path');

var docx = officegen ( {
    type: 'docx',
    orientation: 'portrait'
    // The theme support is NOT working yet...
    // themeXml: themeXml
} );

// Remove this comment in case of debugging Officegen:
// officegen.setVerboseMode ( true );

docx.on ( 'error', function ( err ) {
    console.log ( err );
});
var pObj = docx.createListOfNumbers ();

pObj.addText ( 'Option 1' );

var pObj = docx.createListOfNumbers ();

pObj.addText ( 'Option 2' );

docx.putPageBreak ();

var aa = docx.createListOfNumbers();
aa.addText('aaaaa1')
var out = fs.createWriteStream ( 'tmp/out.docx' );

out.on ( 'error', function ( err ) {
    console.log ( err );
});

async.parallel ([
    function ( done ) {
        out.on ( 'close', function () {
            console.log ( 'Finish to create a DOCX file.' );
            done ( null );
        });
        docx.generate ( out );
    }

], function ( err ) {
    if ( err ) {
        console.log ( 'error: ' + err );
    } // Endif.
});