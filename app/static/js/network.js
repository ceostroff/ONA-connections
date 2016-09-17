var first,
    second;

var graph,
    data,
    mouseover = false;

$(document).ready(function() {
    graph  = d3_init();
    
    d3.csv('static/js/details.csv', function(csv) {
	console.log(csv);
	data = csv;
	searchInit();
    });

    function searchInit() {
	$('.twitter-submit').submit(function(e) {
	    e.preventDefault();
	    
	    var twitterName = $(this).find('#username').val(),
	        result;

	    $(this).find('#username').val('');

	    if (first === undefined) {
		$('#headline').fadeTo("fast", 0).slideUp(200);
		$('#start-desc').animate({'opacity': 0}, 200, function() {
		$(this).text('This is your conference network - the people you follow who follow you back. Enter someone else\'s Twitter name to find the shortest path to them.');
		}).animate({'opacity': 1}, 200);

		$('#particles').fadeTo('slow', 0, function() {
		    $(this).css('display', 'none');
		})
	    }
	    
	    if (twitterName[0] == '@') {
		for (var i = 0; i < data.length; i++) {
		    console.log('submitted: ' + twitterName.toLowerCase() + ' database: ' + '@' + data[i]['username'].toLowerCase());
		    if (twitterName.toLowerCase() === '@' + data[i]['username'].toLowerCase()) {

			result = data[i]['id'];
			break;
		    }
		} 
	    } else {
		for (var i = 0; i < data.length; i++) {
		    if (twitterName.toLowerCase() === data[i]['name'].toLowerCase()) {
			result = data[i]['id'];
			break;
		    }
		}
	    }

	    console.log(result);

	    if (first == undefined) {
		first = result;
		getFirst(first);
	    } else {
		second = result;
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
	    graph(result);
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
	    graph(result);
	},
	error: function(request, status, error) {
	    console.log(request);
	}
    })
}

function d3_init() {

    console.log('init');
    var width = d3.select('#network').node().getBoundingClientRect().width,
	height = d3.select('#network').node().getBoundingClientRect().height,
	radius = 20;

    var nodes = [],
	links = [];

    var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.gravity(0.05)
	.distance(100)
	.charge(-300)
    	.size([width, height])
	.on('tick', tick);
    
    var svg = d3.select('#network').append('svg')
	.attr('height', height)
	.attr('width', width);

    var node = svg.selectAll(".node"),
	link = svg.selectAll(".link");

    var node = svg.selectAll(".node"),
	link = svg.selectAll(".link");

    function tick() {
	node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
	    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })

	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });
    }
 

    // function tick() {
    // 	link.attr("x1", function(d) { return d.source.x; })
    // 	    .attr("y1", function(d) { return d.source.y; })
    // 	    .attr("x2", function(d) { return d.target.x; })
    // 	    .attr("y2", function(d) { return d.target.y; });

    // 	node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    // 	    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
    // }

    function update(data) {

	links.length = 0;
	nodes.length = 0;
	
	for (var i = 0; i < data.nodes.length; i++) {
	    nodes.push(data.nodes[i]);
	}

	for (var i = 0; i < data.edges.length; i++) {
	    links.push(data.edges[i]);
	}

	console.log(links);

	link = link.data(force.links(), function(d) {return d.source + "-" + d.target; });
	console.log(link);
	link.enter().insert('line', '.node').attr('class', 'link').style('stroke', '#aaa');
	link.exit().remove();

	node = node.data(force.nodes(), function(d) {return d.id;})
	node.enter()
	    .append('circle')
	    .attr('class', function(d) { return "node " + d.id; })
	    .attr('r', radius)
	    .style('fill', function(d) {
		if (d['id'] == first || d['id'] == second) {
		    return '#ed82af';
		} else {
		    return '#404D94';
		}
	    })
	    .style('stroke', 'white')
	    .on('mouseover', function(d) {
		showToolTip(d);
	    })
	    .on('mouseout', function(d) {
		hideToolTip();
	    });
	node.exit().remove();
	
	force.start();
	
    }

    return update;
}

function hideToolTip() {
    $('#tooltip').css('display', 'none').css('opacity', 0);
}

function showToolTip(d) {
    var x = d['x'],
	y = d['y'],
	id = d['id'],
	details = $.grep(data, function(e, i){
	    return data[i]['id'] == id;
	});

    console.log(details['0']);

    $('#tooltip img').attr('src', details[0]['image']);
    $('#tooltip-name h4').text(details[0]['name']);
    $('#tooltip-name a').text(details[0]['username']);
    $('#bio').text(details[0]['bio']);
    
    $('#tooltip').css('display', 'inline-block')
	.css('left', function() {
	    return x - $(this)[0].getBoundingClientRect().width / 2;
	})
	.css('top', function() {
	    return y - 15 - $(this)[0].getBoundingClientRect().height;
	}).fadeTo('fast', 1);
	
}
