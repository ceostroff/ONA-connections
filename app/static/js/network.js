$(document).ready(function() {

    var data;
    
    d3.csv('static/js/twitter_details.csv', function(csv) {
	data = csv;
	searchInit();
    });

    console.log(data);

    function searchInit() {
	$('.twitter-submit').submit(function(e) {
	    e.preventDefault();
	    
	    var twitterName = $(this).find('#username').val(),
	        result;

	    console.log(twitterName + '\n');
	    
	    if (twitterName[0] == '@') {
		result = $.grep(data, function(e, i){
		    if (e.username.toLowerCase() == twitterName.toLowerCase()) {
			return data[i]['id'];
		    }
		});
	    } else {
		result = $.grep(data, function(e, i){
		    if (e.name.toLowerCase() == twitterName.toLowerCase()) {
			return data[i]['id'];
		    }
		});
	    }

	    sendAjax(result);
	});
    }
});

function sendAjax(id) {
    $.ajax({
	type: 'POST',
	url: '/submit',
	data: {"id": id},
	datatype: "JSON",
	success: function(result) {
	    console.log(result);
	},
	error: function(request, status, error) {
	    console.log(status);
	}
    })
}
