function sortPlots() {

    var x_axis = $('#x_axis_search').find(":selected").val();
    var y_axis = $('#y_axis_search').find(":selected").val();
    var filter = $('#filter_type').find(":selected").val();
    console.log(filter)
    var normalization = $('#normalization').find(":selected").val();

    var x_axis_text = $('#x_axis_search').find(":selected").text();
    var y_axis_text = $('#y_axis_search').find(":selected").text();
    var filter_text = $('#filter_type').find(":selected").text();
    var normalization_text = $('#normalization').find(":selected").text();

    var rows = [];
    var columns = [];
    var filtered = [];
    var xy_sort = [];

    $(".selected_options").empty().append("<h3> x-axis: " + x_axis_text + "</h3>");
    $(".selected_options").append("<h3> y-axis: " + y_axis_text + "</h3>");
    $(".selected_options").append("<h3> filter: " + filter_text + "</h3>");
    $(".selected_options").append("<h3> nomalization: " + normalization_text + "</h3>");

    // filter type being determined
    // filter options are displayed through filter_type.js
    var sort_options = ["season", "mix_type", "location"];
    sort_options.splice(sort_options.indexOf(x_axis), 1);
    sort_options.splice(sort_options.indexOf(y_axis), 1);
    var filter_type = sort_options[0];


    // accesses the manually updated json file on s3 bucket
    $.getJSON("https://s3-us-west-1.amazonaws.com/lctk.data/derin-test/2_plots_list.json", function(plots) {
        if ((x_axis != y_axis)) {
          // collects all the objects with the corresponding filter type in array - filtered
            for (var plot = 0; plot < plots.length; plot++) {
                if ((plots[plot][filter_type] == filter) && (plots[plot].normalization == normalization)) {
                    filtered.push(plots[plot]);
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
                    $(".row" + x).append("<div class='plots'>");
                    $(".row" + x).append("<img src=" + '"' + xy_sort[x][y].model_img_url + '"' + "style='width:100%>'" + "</br>");
                    $(".row" + x).append("<a href=" + '"' + xy_sort[x][y].csv_url + '"' + "download target='_blank'><i class='fa fa-download'></i> Download CSV</a>");
                    $(".row" + x).append("</div>");
                }
                $("#content").append("</div>");
            }
        // error message
        } else {
          $("#content").empty().append("<h2>please select a different value for each dropdown and make sure each drop down has a selected value</h2>")
        }
    });
}
