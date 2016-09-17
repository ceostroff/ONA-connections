var first,
    second,
    names,
    results;

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
	var search_data = data.map(function(d){return '@' + d['username']}).concat(data.map(function(d){return d['name']}));
	
	var engine = new Bloodhound({
	    local: search_data,
	    queryTokenizer: Bloodhound.tokenizers.whitespace,
	    datumTokenizer: Bloodhound.tokenizers.whitespace
	});
	
	$('#name-1, #name-2').typeahead({
	    minLength: 2,
	    highlight: true
	},{
	    name: 'my-dataset',
	    source: engine
	});
	
	$('.twitter-submit').submit(function(e) {
	    $('#error').text('');
	    $('#connection-text').text('');
	    e.preventDefault();
	    
	    names = [$(this).find('#name-1').val(), $(this).find('#name-2').val()];
	    results = [];

	    console.log(names);

	    for (var i = 0; i < names.length; i++) {
		if (names[i][0] == '@') {
		    for (var j = 0; j < data.length; j++) {
			if (names[i].toLowerCase() === '@' + data[j]['username'].toLowerCase()) {
			    
			    results[i] = data[j]['id'];
			    break;
			}
		    } 
		} else {
		    for (var j = 0; j < data.length; j++) {
			if (names[i].toLowerCase() === data[j]['name'].toLowerCase()) {
			    results[i] = data[j]['id'];
			    break;
			}
		    }
		}
	    }

	    first = results[0];
	    second = results[1];

	    console.log(results);

	    if (results[0] === undefined) {
		getFirst(results[1]);
	    } else if (results[1] === undefined) {
		getFirst(results[0]);
	    } else {
		getSecond(results[0], results[1]);
	    }
	});
    }
});

function getSecond(first, second) {
    $('#network').append('<h2 id="loading">Loading. This could take a minute.</h2>');
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

	    $('#loading').remove();

	    if (!result) {
		$('#error').text("The app encountered an error. Try again with different names!");
	    } else {
		var distance = parseInt(result['length']) - 2;
		if (distance == 1) {
		    var num_logic = 'is <span class="pink">' + distance + '</span> person';
		} else {
		    var num_logic = 'are <span class="pink">' + distance + '</span> people';
		}
		$('#connections-info').html('There ' + num_logic + ' between <span class="purple">' + names[0] + '</span> and <span class="purple">' + names[1] + '.</span>');
		graph(result);
	    }
	},
	error: function(request, status, error) {
	    console.log(request);
	}
    })
}

function getFirst(id) {
    $('#network').append('<h2 id="loading">Loading. This could take a minute.</h2>');
    $.ajax({
	type: 'GET',
	url: '/submit-first/',
	data: {"id": id},
	contentType: 'application/json',
	datatype: 'json',
	success: function(result) {

	    $('#loading').remove();
	    
	    if (typeof result === 'string') {
		result = undefined;
		$('#error').text(result);
	    } else {
		$('#particles').fadeTo('slow', 0, function() {
		    $(this).css('display', 'none');
		});
		
		graph(result);
	    }
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

    if (details[0]) {
		$('#tooltip img').css('display', 'block');
	$('#tooltip img').attr('src', details[0]['image']);
	$('#tooltip-name h4').text(details[0]['name']);
	$('#tooltip-name a').text(details[0]['username']);
	$('#bio').text(details[0]['bio']);
    } else {
	$('#tooltip img').css('display', 'none');
	$('#tooltip-name h4').text('');
	$('#tooltip-name a').text('');
	$('#bio').text("Oh no! Something went wrong and we can't find information for that user. Sorry about that!");
    }

    
    $('#tooltip').css('display', 'inline-block')
	.css('left', function() {
	    console.log((x - $(this)[0].getBoundingClientRect().width / 2));
	    return Math.max((x - $(this)[0].getBoundingClientRect().width / 2), 0);
	})
	.css('top', function() {
	    return y - 15 - $(this)[0].getBoundingClientRect().height;
	}).fadeTo('fast', 1);
	
}
