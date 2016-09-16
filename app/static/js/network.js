var first;

$(document).ready(function() {

    var data;
    
    d3.csv('static/js/twitter_details.csv', function(csv) {
	data = csv;
	searchInit();
    });

    function searchInit() {
	$('.twitter-submit').submit(function(e) {
	    e.preventDefault();
	    
	    var twitterName = $(this).find('#username').val(),
	        result;
	    
	    if (twitterName[0] == '@') {
		$.grep(data, function(e, i){
		    if (e.username.toLowerCase() == twitterName.toLowerCase()) {
			result = data[i]['id'];
		    }
		});
	    } else {
		$.grep(data, function(e, i){
		    if (e.name.toLowerCase() == twitterName.toLowerCase()) {
			retult = data[i]['id'];
		    }
		});
	    }

	    if (first == undefined) {
		first = result;
		getFirst(first);
	    } else {
		getSecond(first, result)
	    }
	});
    }
});

function getSecond(first, second) {
    $.ajax({
	type: 'GET',
	url: '/submit-second/',
	data: {
	    "first": first,
	    "second": second,
	},
	contentType: 'application/json',
	datatype: 'json',
	success: function(result) {
	    console.log(result);
	},
	error: function(request, status, error) {
	    console.log(request);
	}
    })
}

function getFirst(id) {
    $.ajax({
	type: 'GET',
	url: '/submit-first/',
	data: {"id": id},
	contentType: 'application/json',
	datatype: 'json',
	success: function(result) {
	    console.log(result);
	},
	error: function(request, status, error) {
	    console.log(request);
	}
    })
}
