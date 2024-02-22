let jsonFiles = [
  { name: "Star Wars Episode 1", url: "starwars-episode-1-interactions-allCharacters.json" },
  { name: "Star Wars Episode 2", url: "starwars-episode-2-interactions-allCharacters.json" },
  { name: "Star Wars Episode 3", url: "starwars-episode-3-interactions-allCharacters.json" },
  { name: "Star Wars Episode 4", url: "starwars-episode-4-interactions-allCharacters.json" },
  { name: "Star Wars Episode 5", url: "starwars-episode-5-interactions-allCharacters.json" },
  { name: "Star Wars Episode 6", url: "starwars-episode-6-interactions-allCharacters.json" },
  { name: "Star Wars Episode 7", url: "starwars-episode-7-interactions-allCharacters.json" },
  { name: "Star Wars Episode all", url: "starwars-full-interactions-allCharacters.json" }
];

// Dropdown menu
var select = document.createElement("select");
select.id = "jsonSelect";

// Add all options to choose from
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select.appendChild(option);
});

document.body.appendChild(select);

select.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;
  
  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

// Define zoom behavior
var zoom = d3.zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on("zoom", zoomed, { passive: true }); // Add { passive: true } here

// Append SVG element
var svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .call(zoom); // Add zoom behavior to the SVG

// Append a 'g' element to group nodes and links
var g = svg.append("g");

// Function to handle zoom event
function zoomed(event) {
  // Get the current transform
  var transform = event.transform;

  // Apply the transform to the 'g' element containing nodes and links
  g.attr("transform", transform);
}


    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      var u = g.selectAll('.links') // select within the 'g' element
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });
    }

    var selectedNode = null;
    function updateNodes() {
      g.selectAll('.nodes') // select within the 'g' element
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
          showTooltip(d);
          if (selectedNode !== null && selectedNode !== this) {
            // Reset the appearance of the previously selected node
            d3.select(selectedNode).classed("highlighted", false);
          }
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode = this; // Update the last selected node
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        });
    }

    function tooltipContent(d) {
      var content = "";
      content += "Name: " + d.name + "<br/>";
      content += "Value: " + d.value + "<br/>";
     
      return content;
    }
  
    function showTooltip(d) {
      var tooltip = d3.select("#tooltip");
      tooltip.html(tooltipContent(d));
      tooltip.style("opacity", 0.9);
    }
    
    function hideTooltip() {
      var tooltip = d3.select("#tooltip");
      tooltip.style("opacity", 0.9); // Set to 0 if you want the tooltip to disappear
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }
  
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
