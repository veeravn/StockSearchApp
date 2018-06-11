var curr_stock_json;
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1579905572322363',// application ID
        xfbml      : true,
        version    : 'v2.5'
    });
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});
$( document ).ready(function(){
    if((localStorage.length) != 0){
        for(var i= 0; i < localStorage.length; i++){
            // need to get symbol back
            // will return the key name localStorage.key(i), use the symbol as the key name ，value should be “TRUE”
            var symbol =  localStorage.key(i);
            // need to call the ajax to render the favorite list
            $.ajax({
                url: "/api/search",
                data: {symbolVal: symbol },
                //async: false,
                type: "GET",
                datatype: "json",
                success: function(result) {
                    var jsonObject = jQuery.parseJSON(result);
                    generateFavoriteRow(jsonObject);
                }
            });
        }
    }
    $('#searchForm').on('submit', function(e){
    	e.preventDefault();
    	var symbol = $("#stockInput").val();
    	generateFormSectionTwo(symbol);
    });
    //handle the refreshButton problem
    $("#refreshButton").click(function(e) {
    	refreshFavoritePannel();
    });
    // handle autoRefreshButton
    var autoRefreshFavouriteId = null;
    $("#autoRefreshButton").change(function() {
    	console.log("autoRefreshButton");
        if ($("#autoRefreshButton").prop('checked')) {
           autoRefreshFavouriteId  = setInterval(refreshFavoritePannel, 5000);
    	} else {
    		clearInterval(autoRefreshFavouriteId);
    	}
    });
    $( "#stockInput" ).autocomplete({
        //source: JSON data retrieved from server
        source: function( request, response ) {
            $.ajax({
                url: "/api/lookup",
                data: { input: request.term},
                type: "GET",
                datatype: "json",
                success: function( result ) {
                    var jsonObject = jQuery.parseJSON(result);

                    if(jsonObject.length==0) {
                       document.getElementById("validationInformation").innerHTML = "Select a valid entry";
                        $("#nextSlide").prop('disabled', true);
                       // $("#validationInformation").innerHTML = "Select a valid entry";
                        response(null);

                    }
                    else {
                        document.getElementById("validationInformation").innerHTML = "";

                        var data = new Array();

                        for(var i=0; i<jsonObject.length; i++) {
                            data[i] = { label: jsonObject[i].Symbol + " - " + jsonObject[i].Name + " ( " + jsonObject[i].Exchange + " ) ", value: jsonObject[i].Symbol};
                        }
                        response( data );

                    }
                }
            });
        }
    });
    $("#favouriteButton").click(function(e) {
        e.preventDefault();
        if (curr_stock_json == null) {
            return;
        }
        // get the current objcet Symbol
        var stockSymbol = curr_stock_json.Symbol;
        // check if the stockSymbol was in localStorage
        if(localStorage.length == 0 || localStorage.getItem(stockSymbol) === null){
            // the current symbol not in favorite list, we need add it;
            localStorage.setItem(stockSymbol,"TRUE");
            // update Start color
            updateStarSpan(stockSymbol);
            generateFavoriteRow(curr_stock_json);
        } else{
            //localStorage.removeItem(stockSymbol);
            //updateStarSpan(stockSymbol);
            deleteClick(stockSymbol);
        }
    });
});

function clearResult(){
    document.getElementById("validationInformation").innerHTML = " ";
    document.myform.inputText.value="";
    $("#myCarousel").carousel(0);
    $("#stockDetailSection").empty();
    $("#stockChart").empty();
    //$(".well").remove();
    $("#newsFeeds").empty();
    //$("#newsFeeds").empty();
    $('#HistoricalCharts').empty();
    $("#nextSlide").prop('disabled', true);
}
function _fixDate(dateIn) {
	var dat = new Date(dateIn); // create data object
	return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
}
function showArrow(value) {
	if(value>0) {
		//arrow image
		return "<img alt= \"Green_Arrow_Up\" src=\"/images/up.png\">";
	}
	else if(value<0) {
		 //arrow image
		return "<img alt= \"Red_Arrow_Down\" src=\"/images/down.png\">";
	}
	else return "";
}
// change color
function changeTextColor(value, textID) {
	if(value>0) {
		$("#"+textID).css('color', 'green');
	}
	else if(value<0) {
		$("#"+textID).css('color', 'red'); 
	}
}
function ShowFacebook(){
    // need some global variable to store some object at least the symbol we are now 
    //var curr_stock_json;
    // var curr_json_imgURL;
    var json = curr_stock_json;
    var stockImg = "http://chart.finance.yahoo.com/t?s="+json["Symbol"]+"&lang=en-US&width=300&height=300";
    var title = "Current Stock Price of "+ json["Name"]+ " is $" + json["LastPrice"];
    var subhead = "Stock Information of "+json["Name"]+ " ("+json["Symbol"]+")";
    var footText ="LAST PRICE: $"+json["LastPrice"]+", CHANGE: "+json["Change"].toFixed(2)+" ("+json["ChangePercent"].toFixed(2)+"%)";
    // post 
    // may need to check login API first
    FB.ui({
        method: "feed",
        link: "http://dev.markitondemand.com/",
        picture: stockImg,
        name: title,
        description: subhead,
        caption: footText
    }, function(response){
        if (response && !response.error_message) {
          alert('Posted sucessfully');
        } else {
          alert('No Posted');
        }
    });
}
function generateFavoriteRow(jsonObject){
    if(jsonObject["Status"] == "SUCCESS"){
        //create each row in favorite list
        // need to create each id for each row;
        var favorRow = "<tr id=\""+ jsonObject.Symbol +"\">";
        favorRow += "<td>" +"<a href=\"#\" onclick=\"generateFormSectionTwo("+"\'"+jsonObject.Symbol+"\'" +")\">" + jsonObject.Symbol+ "</a></td>";
        //favorRow += "<td>" +"<a href=\"#sectionTwo\"  onclick=\"generateFormSectionTwo("+ jsonObject.Symbol+")\">"+ jsonObject.Symbol + "</a></td>";
        favorRow += "<td>" + jsonObject.Name + "</td>";
        favorRow += "<td>" +"$ " + jsonObject.LastPrice + "</td>";

        var change = jsonObject.Change.toFixed(2);
        var changePercent = jsonObject.ChangePercent.toFixed(2);
        favorRow += "<td id=\"favorSymbol" +jsonObject.Symbol +"\">"+change+" ( "+changePercent +"%"+" ) "+showArrow(changePercent)+"</td>";

        // change 
        var para = "favorSymbol"+jsonObject.Symbol;
        console.log("this is para" + para);
        changeTextColor(changePercent, para);
        refreshFavoritePannel();

        favorRow += "<td>" + (jsonObject.MarketCap/1000000000).toFixed(2) + " Billion</td>"
        var trashButton = "<button type=\"button\" class=\"btn btn-default\" onclick=\"deleteFavouriteRow(this, \'"+jsonObject .Symbol + "\');\"><span class=\"glyphicon glyphicon-trash\"></span></button>";
        favorRow += "<td>"+trashButton+"</td>"; 
        favorRow += "</tr>";
        $("#favoriteTable").append(favorRow);
    }
}
function deleteFavouriteRow(deleteButton, stockSymbol) {
	if (typeof(deleteButton) == "object") {
		$(deleteButton).closest("tr").remove();
		localStorage.removeItem(stockSymbol);
		updateStarSpan(stockSymbol);
	}
}
function refreshFavoritePannel(){
	if((localStorage.length) != 0){
		for(var i= 0; i < localStorage.length; i++){
			// need to get symbol back
			// will return the key name localStorage.key(i), use the symbol as the key name ，value should be “TRUE”
			var symbol =  localStorage.key(i);
			// need to call the ajax to render the favorite list
			$.ajax({
				url: "/api/search",
				data: {symbolVal: symbol },
				//async: false,
				type: "GET",
				datatype: "json",
				success: function(result) {
					var jsonObject = jQuery.parseJSON(result);
					$("#"+jsonObject.Symbol).find("td:eq(1)").html(jsonObject.Name);
					$("#"+jsonObject.Symbol).find("td:eq(2)").html("$ " + jsonObject.LastPrice);
					var change = jsonObject.Change.toFixed(2);
					var changePercent = jsonObject.ChangePercent.toFixed(2);
					$("#"+jsonObject.Symbol).find("td:eq(3)").html(change+" ( "+changePercent +"%"+" ) "+showArrow(changePercent));
					var para = "favorSymbol"+jsonObject.Symbol;
					changeTextColor(changePercent,para);
				}
			});
		}
	}
}
function deleteClick(Symbol){
    
	$("#"+Symbol).remove();
	localStorage.removeItem(Symbol);
	updateStarSpan(Symbol);
}


function render(data) {
	// split the data set into ohlc and volume
	// used in serail ohlc
	var ohlc = _getOHLC(data);
	var symbol = data.Elements[0].Symbol;
	// set the allowed units for data grouping
	var groupingUnits = [['week',[1]], ['month',[1, 2, 3, 4, 6]]];
	// create the chart
	$('#HistoricalCharts').highcharts(
		'StockChart', {
			//set up the chart width
			chart: {width: 900},
			navigation:{buttonOptions:{enabled:false}},
			rangeSelector: {selected: 0,
			inputEnabled:false,
			allButtonsEnabled: true,
			buttons: [{
				type: 'week',
				count: 1,
				text: '1w'
			}, {
				type: 'month',
				count: 1,
				text: '1m'
			},{
				type: 'month',
				count: 3,
				text: '3m'
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},// use the range selector to defind the botton
		title: {
			text: symbol + ' Stock Value'
		},
		yAxis: [{
			title: {
				text: 'Stock Value'
			 },
			height: 200,
			lineWidth: 2
		}],
		series: [{
			type: 'area',
			name: symbol,
			data: ohlc,
			dataGrouping: {
				units: groupingUnits
			},
			tooltip:{
				valueDecimals:2,
				valuePrefix:"$"
			},
		}],
		credits: {
			enabled:false
		}
	});
}
function _getOHLC(json) {
	var dates = json.Dates || [];
	var elements = json.Elements || [];
	var chartSeries = [];
	if (elements[0]){
		for (var i = 0, datLen = dates.length; i < datLen; i++) {
			var dat = _fixDate( dates[i] );
			var pointData = [
				dat,
				 elements[0].DataSeries['open'].values[i],
				 elements[0].DataSeries['high'].values[i],
				 elements[0].DataSeries['low'].values[i],
				 elements[0].DataSeries['close'].values[i]
			];
			chartSeries.push( pointData );
		}
	}
	return chartSeries;
}

// change the star color
function updateStarSpan(Symbol){
    if (localStorage.getItem(Symbol) == null) {
        $("#favouriteStar").removeClass("glyphicon glyphicon-star").addClass("glyphicon glyphicon-star-empty");
        $("#favouriteStar").css("color", "black");
    } else {

        $("#favouriteStar").removeClass("glyphicon glyphicon-star-empty").addClass("glyphicon glyphicon-star");
        $("#favouriteStar").css("color", "yellow");
    }
}
function generateFormSectionTwo(symbol){
    $("#stockDetailSection").empty();
    $("#stockChart").empty();
    //$(".well").remove();
    $("#newsFeeds").empty();
    //$("#newsFeeds").empty();
    $('#HistoricalCharts').empty();
    // get the detail 
    $.ajax({
        url: "/api/search",
        data: { symbolVal: symbol },
        //async: false,
        type: "GET",
        datatype: "json",
        success: function(result) {
            var jsonObject = jQuery.parseJSON(result);
            if(jsonObject["Message"]=="No symbol matches found for "+symbol+". Try another symbol such as MSFT or AAPL, or use the Lookup API."){
                document.getElementById("validationInformation").innerHTML = "Select a valid entry";
                $("#nextSlide").prop('disabled', true);
                console.log("this is not valid");
                return;
            } else{
                updateStarSpan(jsonObject.Symbol);

                curr_stock_json= jsonObject;// for generate facebook feed;
                if(jsonObject["Status"]=="SUCCESS"){
                    $("#nextSlide").prop('disabled', false);
                    $("#myCarousel").carousel(1);
                    // we need to create a table use JQUERY

                    $("#stockDetailSection").append("<table class=\"table table-striped table-responsive\" id=\"stockDetailTable\"></table>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Name</strong></p></td><td>" + jsonObject.Name + "</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Symbol</strong></p></td><td>" + jsonObject.Symbol + "</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Last Price</strong></p></td><td>" +"$ " + jsonObject.LastPrice + "</td></tr>");
                    // handle the change problem 
                    var change = jsonObject["Change"].toFixed(2);
                    var changePercent = jsonObject["ChangePercent"].toFixed(2);

                    $("#stockDetailTable").append("<tr><td><p><strong>Change (Change Percent)</strong></p></td><td id=\"stock_details_changeTextColor\">" + change+" ( "+changePercent +"%"+" ) "+ showArrow(changePercent)+"</td></tr>");
                    // still need to handle the color of the text
                    changeTextColor(changePercent, "stock_details_changeTextColor");

                    // handle time format problem 
                    var time = moment(jsonObject["Timestamp"]).format("DD MMM YYYY, HH:mm:ss a");
                    $("#stockDetailTable").append("<tr><td><p><strong>Time and Date</strong></p></td><td>" + time + "</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Market Cap</strong></p></td><td>" + (jsonObject.MarketCap/1000000000).toFixed(2) + "Billion</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Volume</strong></p></td><td>" + jsonObject.Volume + "</td></tr>");
                    var changeYTD = jsonObject["ChangeYTD"].toFixed(2);
                    var changePercentYTD =jsonObject["ChangePercentYTD"].toFixed(2);
                    $("#stockDetailTable").append("<tr><td><p><strong>Change YTD (Change Percent YTD)</strong></p></td><td id =\"stock_details_changeYTDTextColor\">" + changeYTD+" ( "+changePercentYTD +"%"+" ) "+showArrow(changePercentYTD) + "</td></tr>");

                    changeTextColor(changePercentYTD, "stock_details_changeYTDTextColor");

                    $("#stockDetailTable").append("<tr><td><p><strong>Low Price</strong></p></td><td>" + "$ "+jsonObject.High + "</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>High Price</strong></p></td><td>" +"$ "+ jsonObject.Low + "</td></tr>");
                    $("#stockDetailTable").append("<tr><td><p><strong>Opening Price</strong></p></td><td>" +"$ "+ jsonObject.Open + "</td></tr>");
                    //below handle chart part

                    $("#stockChart").append(
                        "<div style='width: 450px;height: calc(550px - 32px);background: transparent;padding: 0 !important;'>"+
                        "<iframe id='tradingview_89dad'"+
                        "src='https://www.tradingview.com/widgetembed/?frameElementId=tradingview_89dad&amp;symbol="+
                        jsonObject['Symbol']+
                        "&amp;interval=D&amp;hidesidetoolbar=1&amp;symboledit=0&amp;saveimage=1&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;"+
                        "theme=Dark&amp;style=1&amp;timezone=Etc%2FUTC&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;"+
                        "enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=www.tradingview.com&amp;"+
                        "utm_medium=widget_new&amp;utm_campaign=chart&amp;utm_term="+
                        jsonObject['Symbol']+"'"+
                        " style='width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;'"+
                        "frameborder='0' allowtransparency='true' scrolling='no' allowfullscreen=''>"
                    );
                    $.ajax({
                        url: "/api/news",
                        data: { newsVal : symbol },
                        type: "GET",
                        datatype: "json",
                        success: function(result) {
                            var jsonObject = jQuery.parseJSON(result);
                            var newsCount = jsonObject.length;
                            for(var i=0; i<newsCount; i++){
                                var singleNews = jsonObject[i];
                                var newsContent = "<div class=\"well\">";
                                newsContent += "<p class=\"newsTitle\"><a href=\"" + singleNews.url + "\" target=\"_blank\" >" + singleNews.headline + "</a></p>";
                                newsContent += "<p class=\"newsContent\">" + singleNews.summary + "</p>";

                                newsContent += "<p class=\"newsPublisher\"><b>" +"Publisher: "+ singleNews.source + "</b></p>";
                                var date = moment(singleNews.datetime).format("DD MMM YYYY HH:mm:ss");
                                newsContent += "<p class=\"newsDate\"><b>" + "Date: "+date + "</b></p>";
                                newsContent += "</div>";

                                $("#newsFeeds").append(newsContent);
                            } 
                        }
                    });
                    $.ajax({
                        url: "/api/chart",
                        data: { chartVal: symbol },
                        type: "GET",
                        datatype: "json",
                        success: function(result) {
                            var jsonObject = jQuery.parseJSON(result);
                            render(jsonObject);
                        }
                    });
                }else{
                    document.getElementById("validationInformation").innerHTML = "Select a valid entry";
                    $("#nextSlide").prop('disabled', true);
                    console.log("this is not valid");
                }
            }   
        }
    });
}