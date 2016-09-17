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

	    $(this).find('#username').val('');

	    $('#headline').fadeTo("fast", 0).slideUp(200);
	    $('#start-desc').animate({'opacity': 0}, 200, function() {
		$(this).text('This is your conference network - the people you follow who follow you back. Enter someone else\'s Twitter name to find the shortest path to them.');
	    }).animate({'opacity': 1}, 200);

	    
	    
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
//		animateTitle();
		getFirst(first);
	    } else {
		console.log('first: ', first)
		console.log('second: ', result)
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

function d3_init() {
    var width = window.innerWidth,
	height = 900;

    var nodes = [],
	links = [];

    var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.charge(-400)
	.linkDistance(120)
	.size([width, height])
	.on('tick', tick);
}
