/**
 *
    Author: Kahin Akram
    Date: Jan 24, 2020
    TNM048 Lab 1 - Visual Information-Seeking Mantra
    Focus+Context file
 *
*/
function focusPlusContext(data) {

    // Creating margins and figure sizes
    var margin = { top: 20, right: 20, bottom: 150, left: 40 },
        margin2 = { top: 100, right: 20, bottom: 50, left: 40 },
        width = $("#scatterplot").parent().width() - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 200 - margin2.top - margin2.bottom;

    /**
     * Select Scatter plot div and append svg tag to it.
     * Set position to relative and width to 100% and an arbitrary height
     * Then add the clipping area with clipPath -
     * The clipping path restricts the region to which paint can be applied.
     * After that, append the two g tags we will be using for drawing the focus plus context graphs
     */
    var svg = d3.select("#scatterplot").append("svg")
        .attr("postion", "relative")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Task 1 - Parse date with timeParse to year-month-day
     */
     // D3 is a JavaScript library for producing dynamic, 
     // interactive data visualizations in web browsers
     //
     // Created a variable to parse the date using timeParse
     var parseDate = d3.timeParse("%Y-%m-%d");

    /**
     * Task 2 - Define scales and axes for scatterplot (focus area)
     */
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
   
    /**
     * Task 3 - Define scales and axes for context (Navigation through the data)
     */
    var navXScale = d3.scaleTime().range([0, width]);
    var navYScale = d3.scaleLinear().range([height2, 0]);
    var navXAxis = d3.axisBottom(navXScale);

    /**
     * Task 4 - Define the brush for the context graph (Navigation)
     */
    // Creates an x-axis brush for brushing.
    // This sets up an event listener for the "brush" event, which triggers the function
    // brushed() when the brush is used. 
    // .extent([[0, 0], [width, height2]]): This sets the brush extent, defining the region where
    // the brush can be applied. In this case, it's set to start from [0, 0] (top-left corner) and 
    // extend to [width, height2] (bottom-right corner).
    var brush = d3.brushX().extent([[0, 0], [width, height2]]).on("brush", brushed);

    //Setting scale parameters
    var maxDate = d3.max(data.features, function (d) { return parseDate(d.properties.Date) });
    var minDate = d3.min(data.features, function (d) { return parseDate(d.properties.Date) });
    var maxMag = d3.max(data.features, function (d) { return d.properties.EQ_PRIMARY });
    var minMag = d3.min(data.features, function (d) { return d.properties.EQ_PRIMARY })

    //Calculate todays date.
    maxDate_plus = new Date(maxDate.getTime() + 300 * 144000000)

    /**
     * Task 5 - Set the axes scales, both for focus and context.
     */
    // .domain() method is used to set or retrieve the input 
    // data domain for a scale
    xScale.domain([minDate, maxDate]);
    yScale.domain([minMag, maxMag]);

    navXScale.domain([minDate, maxDate]);
    navYScale.domain([minMag, maxMag]);
    
    //<---------------------------------------------------------------------------------------------------->

    /**
    * 1. Rendering the context chart
    */
    //Append g tag for plotting the dots and axes
    var dots = context.append("g");
    dots.attr("clip-path", "url(#clip)");

    /**
    * Task 6 - Call the navigation axis on context.
    */ //append() --> create new element svg
    context.append("g")                  // Append a <g> element
    .attr("class", "axis axis--x")   // Set the class attribute to "axis axis--x"
    .attr("transform", "translate(0," + height2 + ")")  // Translate the group to the bottom of the visualization
    .call(navXAxis);                  // Call the function navXAxis to generate the x-axis within the group

    /**
     * Task 7 - Plot the small dots on the context graph.
     */

    // Select all existing "dot" elements within the 'dots' selection
    small_points = dots.selectAll("dot")
    
    // Task 7: Bind earthquake data to the selection
    .data(data.features)
    
    // For each data point that doesn't have a corresponding element in the DOM, create a new 'circle' element
    .enter()
    
    // Append a 'circle' element for each data point
    .append("circle")
    
    // Set the class attribute of the circles to "dotContext" for styling
    .attr("class", "dotContext")
    
    // Filter the data points to exclude those with null values in the 'EQ_PRIMARY' property
    .filter(function (d) { return d.properties.EQ_PRIMARY != null })
    
    // Set the x-coordinate of the circle based on the earthquake date, scaled using 'navXScale'
    .attr("cx", function (d) {
        return navXScale(parseDate(d.properties.Date));
    })
    
    // Set the y-coordinate of the circle based on the earthquake magnitude, scaled using 'navYScale'
    .attr("cy", function (d) {
        return navYScale(d.properties.EQ_PRIMARY);
    });

    
     /**
      * Task 8 - Call plot function.
      * plot(points,nr,nr) try to use different numbers for the scaling.
      */
     var points = new Points();
     var nr1 = 100;
     var nr2 = 2;
     points.plot(small_points, nr1, nr2);

    //<---------------------------------------------------------------------------------------------------->

    /**
    * 2. Rendering the focus chart
    */

    //Append g tag for plotting the dots and axes
    var dots = focus.append("g");
    dots.attr("clip-path", "url(#clip)");

    /**
     * Task 10 - Call x and y axis
     */
    focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")") // Transforming
    .call(xAxis);

    focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

    //Add y axis label to the scatter plot
    d3.select(".legend")
        .style('left', "170px")
        .style('top', '300px');
    svg.append("text")
        .attr('class', "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr('x', -margin2.top - 120)
        .attr('text-anchor', "end")
        .attr('dy', ".75em")
        .style("font-size", "20px")
        .text("Magnitude");

    /**
     * Task 11 - Plot the dots on the focus graph.
     */
    selected_dots = dots.selectAll("dot")
        .data(data.features) 
        .enter() // give the new data
        .append("circle")
        .attr("class", "dot") // give class "dot" too every circle
        .attr("opacity", 0.7) // Set opacity
        // Filter the data points to exclude those with null values in the 'EQ_PRIMARY' property
        .filter(function (d) { return d.properties.EQ_PRIMARY != null })
        // Set the x-coordinate of each circle based on the earthquake date, 
        // scaled using 'xScale'
        .attr("cx", function (d) {
            return xScale(parseDate(d.properties.Date));
        })
        // Set the y-coordinate of each circle based on the earthquake 
        // magnitude, scaled using 'yScale'
        .attr("cy", function (d) {
            return yScale(d.properties.EQ_PRIMARY);
        });

    /**
     * Task 12 - Call plot function
     * plot(points,nr,nr) no need to send any integers!
     */
     points.plot(selected_dots);

    //<---------------------------------------------------------------------------------------------------->

    //Mouseover function
    mouseOver(selected_dots);
    //Mouseout function
    mouseOut(selected_dots);

    // DETAILS ON DEMAND - Mouse over function
    function mouseOver(selected_dots){
        selected_dots
        .on("mouseover",function(d){
        
            /**
             * Task 13 - Update information in the "tooltip" by calling the tooltip function.
             */
            points.tooltip(d)

            //Rescale the dots onhover
            d3.select(this).attr('r', 15)

            //Rescale the dots on the map.
            curent_id = d3.select(this)._groups[0][0].__data__.id.toString()
            d3.selectAll(".mapcircle")
                .filter(function (d) { return d.id === curent_id; })
                .attr('r', 15)

            //Call map hover function if implemented!
            //world_map.hovered(d.id);
        });
    }

    //Mouse out function
    function mouseOut(selected_dots){
        selected_dots
            .on("mouseout", function () {
                //Returning to original characteristics
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", function (d) {
                        if (d.properties.DEATHS == null) {
                            return 3
                        }
                        else {
                            return scaleQuantRad(d.properties.DEATHS);
                        }
                    })

                //Reset all the dots on the map
                d3.selectAll(".mapcircle")
                    .filter(function (d) { return d.id === curent_id; })
                    .transition()
                    .duration(500)
                    .attr("r", function (d) {
                        if (d.properties.DEATHS == null) {
                            return 3
                        }
                        else {
                            return scaleQuantRad(d.properties.DEATHS);
                        }
                    })
            });
    }
    //<---------------------------------------------------------------------------------------------------->

    /**
     * Task 9 - Append the brush.
     * Brush must come last because we changes places of the focus and context plots.
     * The brush function is trying to access things in scatter plot which are not yet
     * implmented if we put the brush before.
     */

       context.append("g")
       .attr("class", "brush")
       .call(brush)
       .call(brush.move, xScale.range());

    //<---------------------------------------------------------------------------------------------------->

    //Brush function for filtering through the data.
    // .? is a null check
    function brushed(){
        //Function that updates scatter plot and map each time brush is used
        var s = d3.event.selection || navXScale.range();
        // Update the domain of the main x-axis scale based on the brush selection
        xScale.domain(s.map(navXScale.invert, navXScale));

        // Update the positions of the circles in the scatter plot based on the new xScale domain
        focus.selectAll(".dot")
            .filter(function (d) { return d.properties.EQ_PRIMARY != null })
            .attr("cx", function (d) {
                return xScale(parseDate(d.properties.Date));
            })
            .attr("cy", function (d) {
                return yScale(d.properties.EQ_PRIMARY);
            })

        // Update the x-axis in the main scatter plot
        focus.select(".axis--x").call(xAxis);

        // Check if the brush event type is "end"    
        if (d3.event.type == "end") {
            var curr_view_erth = []

            // Iterate through all circles in the scatter plot
            d3.selectAll(".dot").each(
                function (d, i) {
                    // Check if the date of the earthquake falls within the current xScale domain
                    if (parseDate(d.properties.Date) >= xScale.domain()[0] &&
                        parseDate(d.properties.Date) <= xScale.domain()[1]) {
                        curr_view_erth.push(d.id.toString());
                    }
                });
            /**
             * Remove comment for updating dots on the map.
             */
            curr_points_view = world_map.change_map_points(curr_view_erth)
        }
    }

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Function for hovering the points, implement if time allows.
     */
    this.hovered = function(){
        console.log("If time allows you, implement something here!");
    }

}
