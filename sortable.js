var HEROES

const loadData = heroes => {
    HEROES = heroes  

    window.$('#main_table').DataTable({
        data: createData(),
        "order": [[ 2, "asc" ]], // Default ordering
        "pageLength": 20, // Current rows per page
        "lengthMenu": [[10, 20, 50, 100, -1], [10, 20, 50, 100, "All"]], // Rows per page
        "columns": [
            { "searchable": false }, // row number Cannot be searched
            { "searchable": false, "render": function (data) { // add icon
                return `<img src='${data}'></img>`
            } },
            null, // Name
            { "searchable": false}, // Full name
            { "searchable": false}, // Powerstats
            { "searchable": false}, // Race
            { "searchable": false}, // Gender
            { "searchable": false}, // Height
            { "searchable": false}, // Weight
            { "searchable": false}, // Place of birth
            { "searchable": false} // Alignement
          ],
          "columnDefs": [{ // Apply empty types
            targets: [6, 9, 10],
            type: lowerEmptyMinus
          },{
            targets: [7],
            type: lowerEmptyHeight
          },{
            targets: [8],
            type: lowerEmptyWeight
          },{
            targets: [2, 3, 5],
            type: lowerEmpty,
          }]
    })
}

function load(){
    let mainDiv = document.getElementById("main")
    if (!mainDiv){
        console.error("[ERROR] Main DIV not loaded")
        return
    }
     
    // Request the file fetch, it will download it in your browser cache
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
    .then((response) => response.json()) // parse the response from JSON
    .then(loadData) // .then will call the function with the JSON value
}

// Datatable absolute library
(function( factory ){
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery', 'datatables.net'], function ( $ ) {
            return factory( $, window, document )
        } )
    }
    else if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = function (root, $) {
            if ( ! root ) {
                root = window
            }
 
            if ( ! $ || ! $.fn.dataTable ) {
                $ = require('datatables.net')(root, $).$
            }
 
            return factory( $, root, root.document )
        }
    }
    else {
        // Browser
        factory( jQuery, window, document )
    }
}
(function( $, _window, _document, undefined ) {
'use strict'
 
// Unique value allowing multiple absolute ordering use cases on a single page.
var uniq = 0
 
// Function to encapsulate code that is common to both the string and number
// ordering plug-ins.
var _setup = function ( values ) {
    if ( ! Array.isArray( values ) ) {
        values = [ values ]
    }
 
    var o = {
        name: 'absoluteOrder'+(uniq++),
        alwaysTop: {},
        alwaysBottom: {}
    }
 
    /* In order to provide performance, the symbols that are to be looked for
    are stored as parameter keys in an object, allowing O(1) lookup, rather
    than O(n) if it were in an array.*/
    for ( var i = 0, ien = values.length;  i<ien;  i++ ) {
        var ord = values[i]
 
        if ( typeof ord === 'string' ) {
            o.alwaysTop[ ord ] = true
        }
        else if ( ord.position === undefined || ord.position === 'top' ) {
            o.alwaysTop[ ord.value ] = true
        }
        else {
            o.alwaysBottom[ ord.value ] = true
        }
    }
 
    // Ascending ordering method
    o.asc = function ( a, b, isNumber ) {
        if ( o.alwaysTop[ a ] && o.alwaysTop[ b ] ) {
            return 0
        }
        else if ( o.alwaysBottom[ a ] && o.alwaysBottom[ b ] ) {
            return 0
        }
        else if ( o.alwaysTop[ a ] || o.alwaysBottom[ b ] ) {
            return -1
        }
        else if ( o.alwaysBottom[ a ] || o.alwaysTop[ b ] ) {
            return 1
        }
 
        if ( isNumber ) {
            // Cast as a number if required
            if ( typeof a === 'string' ) {
                a = a.replace(/[^\d\-\.]/g, '') * 1
            }
            if ( typeof b === 'string' ) {
                b = b.replace(/[^\d\-\.]/g, '') * 1
            }
        }
        return ((a < b) ? -1 : ((a > b) ? 1 : 0))
    }
 
    // Descending ordering method
    o.desc = function ( a, b, isNumber ) {
        if ( o.alwaysTop[ a ] && o.alwaysTop[ b ] ) {
            return 0
        }
        else if ( o.alwaysBottom[ a ] && o.alwaysBottom[ b ] ) {
            return 0
        }
        else if ( o.alwaysTop[ a ] || o.alwaysBottom[ b ] ) {
            return -1
        }
        else if ( o.alwaysBottom[ a ] || o.alwaysTop[ b ] ) {
            return 1
        }
 
        if ( isNumber ) {
            if ( typeof a === 'string' ) {
                a = a.replace(/[^\d\-\.]/g, '') * 1
            }
            if ( typeof b === 'string' ) {
                b = b.replace(/[^\d\-\.]/g, '') * 1
            }
        }
        return ((a < b) ? 1 : ((a > b) ? -1 : 0))
    }
    return o
}
 
// String based ordering
$.fn.dataTable.absoluteOrder = function ( values ) {
    var ord = _setup( values )
 
    $.fn.dataTable.ext.type.order[ ord.name+'-asc' ] = ord.asc
    $.fn.dataTable.ext.type.order[ ord.name+'-desc' ] = ord.desc
 
     /* Return the name of the sorting plug-in that was created so it can be used
     with the `columns.type` parameter. There is no auto-detection here. */
    return ord.name
}
 
// Number based ordering - strips out everything but the number information
$.fn.dataTable.absoluteOrderNumber = function ( values ) {
    var ord = _setup( values )
 
    $.fn.dataTable.ext.type.order[ ord.name+'-asc' ] = function ( a, b ) {
        return ord.asc( a, b, true )
    }
    $.fn.dataTable.ext.type.order[ ord.name+'-desc' ] = function ( a, b ) {
        return ord.desc( a, b, true )
    }
    return ord.name
}
}))

function createData(){
    let result = []
    let heroes = HEROES
    for (let i = 0; i < HEROES.length; i++) {
        let tempArr = []
        // What row 
        tempArr.push(i +1)

        // Image 
        tempArr.push(heroes[i].images.xs)

        // Name 
        tempArr.push(heroes[i].name)

        // Full name 
        tempArr.push(heroes[i].biography.fullName)

        // Power stats 
        let stats = heroes[i].powerstats
        tempArr.push(`<pre>INT:&nbsp${stats.intelligence.toString().padStart(3, ' ')}&nbspSTR:&nbsp${stats.strength.toString().padStart(3, ' ')}<br>SPD:&nbsp${stats.speed.toString().padStart(3, ' ')}&nbspDUR:&nbsp${stats.durability.toString().padStart(3, ' ')}<br>PWR:&nbsp${stats.power.toString().padStart(3, ' ')}&nbspCMB:&nbsp${stats.combat.toString().padStart(3, ' ')}</pre>`)
        
        // Race 
        tempArr.push(heroes[i].appearance.race)

        // Gender 
        tempArr.push(heroes[i].appearance.gender)

        // Height 
        tempArr.push(heroes[i].appearance.height)

        // Weight 
        tempArr.push(heroes[i].appearance.weight)

        // Born at 
        tempArr.push(heroes[i].biography.placeOfBirth)

        // Alignement
        tempArr.push(heroes[i].biography.alignment)

        result.push(tempArr)

    }
    return result
}

const lowerEmptyMinus = $.fn.dataTable.absoluteOrder( { // - empty type
    value: '-',
    position: 'bottom'
} )

const lowerEmptyHeight = $.fn.dataTable.absoluteOrder( { // -,0 cm empty type
    value: '-,0 cm',
    position: 'bottom'
} )

const lowerEmptyWeight = $.fn.dataTable.absoluteOrder( { // - lb,0 kg empty type
    value: '- lb,0 kg',
    position: 'bottom'
} )

const lowerEmpty = $.fn.dataTable.absoluteOrder( { // Normal empty type
    value: '',
    position: 'bottom'
} )

load()