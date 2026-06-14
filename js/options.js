import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        groupSize: 2,
        difficulty: 'normal'
    } 

    var pairs = $('#pairs');
    var groupSize = $('#group');
    var difficulty = $('#dif');
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;

    pairs.val(options.pairs);
    groupSize.val(options.groupSize)
    difficulty.val(options.difficulty);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });

    groupSize.on('change', function (){
        options.groupSize = groupSize.val();
    });
    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            pairs.val(options.pairs);
            groupSize.val(options.groupSize);
            difficulty.val(options.difficulty);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
