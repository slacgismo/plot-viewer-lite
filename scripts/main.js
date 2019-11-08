var sortOptions = ["season", "mix_type", "location", "normalization"];
var jsonUrl = "https://s3-us-west-1.amazonaws.com/lctk.data/derin-test/2_plots_list.json";


function sortOptionsLoad() {

    var xAxisStr = "<option disabled selected value> - select x-axis - </option>";
    for (var i = 0; i < sortOptions.length; i++){
        xAxisStr += "<option>" + sortOptions[i] + "</option>";
    }
    $("#x-axis-search").empty().append(xAxisStr);

    var yAxisStr = "<option disabled selected value> - select y-axis - </option>";
    for (var i = 0; i < sortOptions.length; i++){
        yAxisStr += "<option>" + sortOptions[i] + "</option>";
    }
    $("#y-axis-search").empty().append(yAxisStr);

    $.getJSON(jsonUrl, function(plot) {
        plots = plot;
    });
}


function sortPlots() {

    var xAxis = $('#x-axis-search').find(":selected").text();
    var yAxis = $('#y-axis-search').find(":selected").text();
    var filtersArr = [];
    //for when there are more filters than normalization
    for (var l = 0; l < filters.length; l++){
        filtersArr.push($('#filter' + (l + 1)).find(":selected").text());
    }

    var rows = [];
    var columns = [];
    var filtered = [];
    filtered = filtered.concat(plots);
    var xySort = [];
    var rowStr;

    var selectedOptions = "<h3> x-axis: " + xAxis + "</h3>";
    selectedOptions += "<h3> y-axis: " + yAxis + "</h3>";

    for (var v = 0; v < filters.length; v++){
        selectedOptions += "<h3> " + filters[v] + ": " + filtersArr[v] + "</h3>";
    }

    $(".selected-options").empty().append(selectedOptions);
    // filter type being determined
    // filter options are displayed through filter_type.js
    if (xAxis !== yAxis) {
      // collects all the objects with the corresponding filter type in array - filtered
        for (var filt = 0; filt < filters.length; filt++) {
            for (var pl = 0; pl < filtered.length; pl++) {
                if (filtered[pl][filters[filt]] !== filtersArr[filt]) {
                    filtered.splice(pl,1);
                    pl = pl - 1;
                }
            }
        }
        // sorts array acvcording to y-axis input
        filtered.sort((a, b) => (a[yAxis] > b[yAxis]) ? 1 : -1);
        //creates new arrays - rows - of objects with unique y-axis input values
        rows.push(filtered[0]);
        // adds all the rows in to the final array - xySort - which is an array of arrays of objects
        for (var plot = 0; plot < filtered.length - 1; plot++) {
            if (filtered[plot][yAxis] === filtered[plot + 1][yAxis]) {
                rows.push(filtered[plot + 1]);
            } else {
                xySort.push(rows);
                rows = [filtered[plot + 1]];
            }
        }
        xySort.push(rows);
        // sorts all the inner arrays of xySort according to xAxis input
        for (var array = 0; array < xySort.length; array++) {
            xySort[array].sort((a, b) => (a[xAxis] > b[xAxis]) ? 1 : -1);
        }
        // outputs everything in to html page in a grid format
        $("#content").empty();
        for (var x = 0; x < xySort.length; x++) {
            $("#content").append("<div id='rows' class='row" + x + "'>");
            for (var y = 0; y < xySort[x].length; y++) {
                rowStr = "<div class='plots'>";
                rowStr += "<img src='" + xySort[x][y].model_img_url + "'style='width:100%>'" + "</br>";
                rowStr += "<a href='" + xySort[x][y].csv_url + "'download target='_blank'><i class='fa fa-download'></i> Download CSV</a>";
                rowStr += "</div>";
                $(".row" + x).append(rowStr);
            }
            $("#content").append("</div>");
        }
    } else {
        $("#content").empty().append("<h2>please select a different value for each dropdown and make sure each drop down has a selected value</h2>")
    }
}
