// https://s3-us-west-1.amazonaws.com/lctk.data/derin-test/alm_plots.json

var imageUrl = "";
var imageCsv = "";
var sortOptions = [];
var jsonUrl = "";

function runJsonParse(event) {
    if (event.which == 13 || event.keyCode == 13){
        sortOptions = [];
        imageUrl = "";
        imageCsv = "";
        //clears all the divs within the form when the url input changes
        resetForms();
        jsonUrl = document.getElementById('json-url').value;
        jsonUrl = jsonUrl.trim();
        $.ajax({
            url: jsonUrl,
            type: "GET",
            success: function(plot){
                plots = plot;
                var sortOpt = plots[0];
                //checks for the json file structure
                if (Object.values(sortOpt).includes("option", "display")){
                    $('#sort-selector').attr("style", "");
                    //creates sort options list based of tags given in the first object of json
                    for (var i = 0; i < Object.values(sortOpt).length ; i++){
                        if (Object.values(sortOpt)[i] === "option"){
                            sortOptions.push(Object.keys(sortOpt)[i]);
                        }
                        else if (Object.values(sortOpt)[i] === "display"){
                            imageUrl = Object.keys(sortOpt)[i];
                        }
                        else if (Object.values(sortOpt)[i] === "download"){
                            imageCsv = Object.keys(sortOpt)[i];
                        }
                    }
                    plots.splice(0,1);
                    modifySortOpt(sortOptions);
                }
                else {
                    //creates a form to collect required information such as the key name for imageUrl
                    $('#first-form').attr("style", "");
                    var allCheckBoxes = "";
                    for (var i = 0; i < Object.keys(sortOpt).length; i++){
                        allCheckBoxes += "<div class='custom-control custom-checkbox'><input type='checkbox' class='custom-control-input' name='sort-options' value='" + Object.keys(sortOpt)[i] ;
                        allCheckBoxes += "' id='" + Object.keys(sortOpt)[i] + "' ><label class='custom-control-label' for='" + Object.keys(sortOpt)[i] + "'>" + Object.keys(sortOpt)[i] + "</label></div>";
                    }
                    $("#checkboxes").html(allCheckBoxes);
                    var allKeys = "</br><div id='image-url'><label class='col-md-4 control-label'>Display Field</label>";
                    allKeys += "<select id='image-url-field' class='form-control selectpicker'>";
                    for (var i = 0; i < Object.keys(sortOpt).length; i++){
                        allKeys += "<option value='" + Object.keys(sortOpt)[i] + "'>" + Object.keys(sortOpt)[i] + "</option>";
                    }
                    allKeys += "</select></div><div id='image-csv'><label class='col-md-4 control-label'>Download Field</label>";
                    allKeys += "<select id='image-csv-field' class='form-control selectpicker'>";
                    for (var i = 0; i < Object.keys(sortOpt).length; i++){
                        allKeys += "<option value='" + Object.keys(sortOpt)[i] + "'>" + Object.keys(sortOpt)[i] + "</option>";
                    }
                    allKeys += "</select></div></div></div><br><button type='button' id='get-values' class='btn'>Get Values</button>";
                    $("#sort-options").append(allKeys);
                    $("#get-values").click(function(){
                        sortOptions = [];
                        $.each($("input[name='sort-options']:checked"), function(){
                            sortOptions.push($(this).val());
                        });
                        imageUrl = $('#image-url :selected').text();
                        imageCsv = $('#image-csv :selected').text();
                        modifySortOpt(sortOptions);
                        $('#sort-selector').attr("style", "");
                        $('html,body').animate({scrollTop: $("#sort-selector").offset().top-80},'slow');
                    });
                }
            },
            error:function(error){
                resetForms();
                console.log('Error ${error}');
                $('#toast0').attr('style','');
                $('#toast0').toast('show');
            }
        });
    }
}

//posts the drop down menus for the X-axis and y-axiis selection
function modifySortOpt(sortOptions) {
    var xAxisStr = "<option disabled selected value> - select x-axis - </option>";
    for (var i = 0; i < sortOptions.length; i++){
        xAxisStr += "<option>" + sortOptions[i] + "</option>";
    }
    $("#x-axis-search").html(xAxisStr);
    var yAxisStr = "<option disabled selected value> - select y-axis - </option>";
    for (var i = 0; i < sortOptions.length; i++){
        yAxisStr += "<option>" + sortOptions[i] + "</option>";
    }
    $("#y-axis-search").html(yAxisStr);
    $('#axis-options').attr("style", "");
}

// resets all the forms when a different input is entered in to the jsonUrl field
function resetForms() {
    $("#submit-button").empty();
    $("#x-axis-search").empty();
    $("#y-axis-search").empty();
    $("#selected-options").empty();
    $("#content").empty();
    $("#axis-options").attr("style", "display:none");
    $("#sort-options").html("<label>Select the desired sort options</label><div id='checkboxes'></div>");
    $('#sort-selector').attr("style", "display:none");
    $('#first-form').attr("style", "display:none");
}

function sortPlots() {
    var xAxis = $('#x-axis-search').find(":selected").text();
    var yAxis = $('#y-axis-search').find(":selected").text();
    var filtersArr = [];
    //for when there are more filters than normalization
    for (var l = 0; l < filters.length; l++){
        if ($('#filter' + (l + 1) + " option:selected").prop('disabled') !== true){
            filtersArr.push($('#filter' + (l + 1)).find(":selected").val());
        }
    }
    var rows = [];
    var filtered = [];
    filtered = filtered.concat(plots);
    var xySort = [];
    var rowStr;
    var selectedOptions = "<h3> x-axis: " + xAxis + "</h3>";
    selectedOptions += "<h3> y-axis: " + yAxis + "</h3>";
    for (var v = 0; v < filtersArr.length; v++){
        if(filtersArr[v]){
            selectedOptions += "<h3> " + filters[v] + ": " + filtersArr[v] + "</h3>";
        }
    }
    $(".selected-options").html(selectedOptions);
    // filter type being determined
    // filter options are displayed through filter_type.js
    if (xAxis !== yAxis) {
      // collects all the objects with the corresponding filter type in array - filtered
        for (var v = 0; v < filtersArr.length; v++) {
            if(filtersArr[v]){
                for (var pl = 0; pl < filtered.length; pl++) {
                    if (filtered[pl][filters[v]] !== filtersArr[v]) {
                        filtered.splice(pl,1);
                        pl = pl - 1;
                    }
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
                rowStr += "<img src='" + xySort[x][y][imageUrl] + "'style='width:100%>'" + "<br>";
                rowStr += "<a href='" + xySort[x][y][imageCsv] + "'download target='_blank'><i class='fa fa-download'></i> Download CSV</a>";
                rowStr += "</div>";
                $(".row" + x).append(rowStr);
            }
            $("#content").append("</div>");
        }
    $('html,body').animate({scrollTop: $("#plots-content").offset().top-80},'slow');
    } else {
        $('#toast1').attr('style','');
        $('#toast1').toast('show');
        $("#content").empty();
        $("#selected-options").empty();
    }
}
