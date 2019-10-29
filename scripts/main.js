var plots;
function sortOptions() {

    var x_axis_str = "<option disabled selected value> - select x-axis - </option>";
    for (var i = 0; i < sort_options.length; i++){
        x_axis_str += "<option>" + sort_options[i] + "</option>";
    }
    $("#x-axis-search").empty().append(x_axis_str);

    var y_axis_str = "<option disabled selected value> - select y-axis - </option>";
    for (var i = 0; i < sort_options.length; i++){
        y_axis_str += "<option>" + sort_options[i] + "</option>";
    }
    $("#y-axis-search").empty().append(y_axis_str);

    $.getJSON(json_url, function(plot) {
        plots = plot;
        var filters_str = "";
        var lookup = {};
        var result = [];

        for (var l = 0; l < filters.length; l++){
            filters_str += "<label>Filter" + (l+2) + "</label>";
            filters_str += "<select id='filter" + (l+2) + "'>";
            filters_str += "<option disabled selected value> - " + filters[l] + " - </option>";
            lookup = {};
            result = [];
            for (var item, i = 0; item = plots[i++];) {
                console.log("hey");
                var name = item[filters[l]];
                if (!(name in lookup)) {
                    lookup[name] = 1;
                    result.push(name);
                }
            }
            for (var k = 0; k < result.length; k++){
                filters_str += "<option>" + result[k]+ "</option>";
            }
            filters_str += "</select>";
        }
        $("#sort-form").append(filters_str);
    });
}


function sortPlots() {

    var x_axis = $('#x-axis-search').find(":selected").text();
    var y_axis = $('#y-axis-search').find(":selected").text();
    var filter = $('#filter-type').find(":selected").text();
    var filters_arr = [];
    //for when there are more filters than normalization
    for (var l = 0; l < filters.length; l++){
        filters_arr.push($('#filter' + (l+2)).find(":selected").text());
    }

    var rows = [];
    var columns = [];
    var filtered = [];
    var xy_sort = [];
    var row_str;

    var selected_options = "<h3> x-axis: " + x_axis + "</h3>";
    selected_options += "<h3> y-axis: " + y_axis + "</h3>";
    selected_options += "<h3> filter: " + filter + "</h3>";

    for (var v = 0; v < filters.length; v++){
        selected_options += "<h3> " + filters[v] + ": " + filters_arr[v] + "</h3>";
    }
    $(".selected-options").empty().append(selected_options);
    // filter type being determined
    // filter options are displayed through filter_type.js
    sort_options.splice(sort_options.indexOf(x_axis), 1);
    sort_options.splice(sort_options.indexOf(y_axis), 1);
    var filter_type = sort_options[0];
        if ((x_axis != y_axis)) {
          // collects all the objects with the corresponding filter type in array - filtered
            for (var filt = 0; filt < filters_arr.length; filt++) {
                for (var plot = 0; plot < plots.length; plot++) {
                    if ((plots[plot][filter_type] == filter) && (plots[plot][filters[0]] == filters_arr[filt])) {
                        filtered.push(plots[plot]);
                    }
                }
            }
            // sorts array acvcording to y-axis input
            filtered.sort((a, b) => (a[y_axis] > b[y_axis]) ? 1 : -1);
            //creates new arrays - rows - of objects with unique y-axis input values
            rows.push(filtered[0]);
            // adds all the rows in to the final array - xy_sort - which is an array of arrays of objects
            for (var plot = 0; plot < filtered.length - 1; plot++) {
                if (filtered[plot][y_axis] == filtered[plot + 1][y_axis]) {
                    rows.push(filtered[plot + 1]);
                } else {
                    xy_sort.push(rows);
                    rows = [filtered[plot + 1]];
                }
            }
            xy_sort.push(rows);
            // sorts all the inner arrays of xy_sort according to x_axis input
            for (var array = 0; array < xy_sort.length; array++) {
                xy_sort[array].sort((a, b) => (a[x_axis] > b[x_axis]) ? 1 : -1);
            }
            // outputs everything in to html page in a grid format
            $("#content").empty();
            for (var x = 0; x < xy_sort.length; x++) {
                $("#content").append("<div id='rows' class='row" + x + "'>");
                for (var y = 0; y < xy_sort[x].length; y++) {
                    row_str = "<div class='plots'>";
                    row_str += "<img src=" + '"' + xy_sort[x][y].model_img_url + '"' + "style='width:100%>'" + "</br>";
                    row_str += "<a href=" + '"' + xy_sort[x][y].csv_url + '"' + "download target='_blank'><i class='fa fa-download'></i> Download CSV</a>";
                    row_str += "</div>";
                    $(".row" + x).append(row_str);
                }
                $("#content").append("</div>");
            }
        }
        // error message
        else {
            $("#content").empty().append("<h2>please select a different value for each dropdown and make sure each drop down has a selected value</h2>")
        }
}
