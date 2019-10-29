//used for the filter type to be determined once x_axis and y_axis are selected

$(document).ready(function() {
    var plots = [];

    $("#y-axis-search, #x-axis-search").change(function() {
        $("#filter-type").empty().append('<option disabled selected value> -Filter- </option>')
        $.getJSON(json_url, function(plots) {

            var y_axis = $("#y-axis-search");
            var x_axis = $("#x-axis-search");
            var dist_options = [];

            //collects all the distinct values of each sort_option feature in the json
            for (var y = 0; y < sort_options.length; y++) {
                var lookup = {};
                var result = [];

                for (var item, i = 0; item = plots[i++];) {
                    var name = item[sort_options[y]];

                    if (!(name in lookup)) {
                        lookup[name] = 1;
                        result.push(name);
                    }
                }
                result.sort();
                dist_options.push(result);
            }
            //dist_options includes distinct values of sort options as seperate arrays of strings

            $("#filter-type").empty().append('<option disabled selected value> -Filter- </option>');


            //so far only works for 3 sort options, update below to make it work for more
            var filter_str;
            if (x_axis.val() === sort_options[0]) {
                if (y_axis.val() === sort_options[1]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[2] + "</option>");
                    for (var b = 0; b < dist_options[2].length; b++){
                        filter_str += ("<option>" + dist_options[2][b] + "</option>");
                    }
                }
                if (y_axis.val() === sort_options[2]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[1] + "</option>");
                    for (var b = 0; b < dist_options[1].length; b++){
                        filter_str += ("<option>" + dist_options[1][b] + "</option>");
                    }
                }
            }
            else if (x_axis.val() === sort_options[1]) {
                if (y_axis.val() === sort_options[0]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[2] + "</option>");
                    for (var b = 0; b < dist_options[2].length; b++){
                        filter_str += ("<option>" + dist_options[2][b] + "</option>");
                    }
                }
                if (y_axis.val() === sort_options[2]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[0] + "</option>");
                    for (var b = 0; b < dist_options[0].length; b++){
                        filter_str += ("<option>" + dist_options[0][b] + "</option>");
                    }
                }
            }
            else if (x_axis.val() === sort_options[2]) {
                if (y_axis.val() === sort_options[1]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[0] + "</option>");
                    for (var b = 0; b < dist_options[0].length; b++){
                        filter_str += ("<option>" + dist_options[0][b] + "</option>");
                    }
                }
                if (y_axis.val() === sort_options[0]) {
                    filter_str = ("<option disabled selection value> - " + sort_options[1] + "</option>");
                    for (var b = 0; b < dist_options[1].length; b++){
                        filter_str += ("<option>" + dist_options[1][b] + "</option>");
                    }
                }
            }
            $("#filter-type").empty().append(filter_str);
        });
    });
});
