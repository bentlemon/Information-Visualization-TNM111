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

// Dropdown menu for content1
var select1 = document.createElement("select");
select1.id = "jsonSelect1";

// Add all options to choose from
jsonFiles.forEach(function (file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select1.appendChild(option);
});

document.getElementById("content1").appendChild(select1);

select1.addEventListener("change", async function () {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    //console.log("Data loaded successfully for content1:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;
    let selectedRange = [];


    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      // Extract all node IDs
      var allNodeIds = nodes.map(function (d) {
        return d.id;
      });
    
      // Filter links based on the selected range
      var filteredLinks = links.filter(function (d) {

        return d.value >= selectedRange[0] && d.value <= selectedRange[1] &&
          allNodeIds.includes(d.source.id) && allNodeIds.includes(d.target.id);
      });

      var u = d3.select('#content1 .links')
        .selectAll('line')
        .data(filteredLinks, function (d) {
          return d.source.id + "-" + d.target.id; // Unique identifier for each link
        })
        .join('line')
        .attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y });
    }
   /* function updateLinks() {
      var u = d3.select('#content1 .links')
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('x1', function(d) { return d.source.x })
          .attr('y1', function(d) { return d.source.y })
          .attr('x2', function(d) { return d.target.x })
          .attr('y2', function(d) { return d.target.y })
          .on("click", function(event, d) { 
           
            showTooltip2(d);
            d3.select('#content1 .nodes').selectAll('circle')
              .classed("highlighted", function(node) {
                return node === d.source || node === d.target;
              });
            
          });
      }*/
      

   
      var tooltipVisible = false; // Variable to track tooltip visibility
    var selectedNode1 = null;
    function updateNodes() {
      // Filter nodes based on the selected range
      var filteredNodes = nodes.filter(function (d) {
        // Check if there is at least one link connected to the node within the selected range
        return d.value >= selectedRange[0] && d.value <= selectedRange[1] &&
          links.some(link => 
            (link.source.id === d.id || link.target.id === d.id) &&
            link.value >= selectedRange[0] && link.value <= selectedRange[1]
          );
      });
      // --------------------------------------------------------------------------------
      d3.select('#content1 .nodes')
        .selectAll('circle')
       .data(nodes)
        .join('circle')
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr("r", function (d) { return d.value; })
        .attr("fill", function (d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("click", function (event, d) {
          // Toggle tooltip visibility
          if (tooltipVisible) {
            hideTooltip();
          } else {
            showTooltip(d);
          }

          // Highlight logic
          if (selectedNode1 !== null && selectedNode1 !== this) {
            d3.select(selectedNode1).classed("highlighted", false);
          }

          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode1 = this;

          // Node comparison logic
          var nodeName = d.name;
          var nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
          var isNodePresentInContent2 = nodesInContent2.some(function (node) {
            return node.name === nodeName;
          });

          if (isNodePresentInContent2 !== null && isNodePresentInContent2 !== this) {
            d3.selectAll('#content2 .nodes circle')
              .classed("highlighted", false);
          }

          // Node highlighting logic for content2
          d3.selectAll('#content2 .nodes circle')
            .classed("highlighted", function (node) {
              return node.name === nodeName;
            });

          // Update tooltip visibility status
          tooltipVisible = !tooltipVisible;
        })
        .on("anotherEvent", function (event, d) {
          // Always hide the tooltip when anotherEvent occurs
          hideTooltip();
          // Reset tooltip visibility status
          tooltipVisible = false;
        });
    }

   function updateNodesAndLinks() {
      updateLinks();
      updateNodes();
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content1:", error);
  }
});


// Dropdown menu for content2 -----------------------------
var select2 = document.createElement("select");
select2.id = "jsonSelect2";

// Add all options to choose from
jsonFiles.forEach(function (file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select2.appendChild(option);
});

document.getElementById("content2").appendChild(select2);

select2.addEventListener("change", async function () {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    //console.log("Data loaded successfully for content2:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      var u = d3.select('#content2 .links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y });
    }

    function updateNodes() {
      d3.select('#content2 .nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr("r", function (d) { return d.value; })
        .attr("fill", function (d) { return d.colour; })
        .attr("opacity", 0.7)
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content2:", error);
  }
});

// ----------------------------------------------------------

function tooltipContent(d) {
  var content = "";
  content += "Name: " + d.name + "<br/>";
  content += "Value: " + d.value + "<br/>";

  var nodeName = d.name;
  var nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
  var findValueNode = nodesInContent2.find(function (node) {
    return node.name === nodeName;
  });

  if (findValueNode) {
    var content2 = "";
    content2 += "Name: " + d.name + "<br/>";
    content2 += "Value: " + findValueNode.value + "<br/>";
    return content + content2;
  } else {
    return content;
  }
}

function tooltipContent2(d) {
  var content = "";
  var nodes = d3.selectAll('#content1 .nodes circle').data();
  // Hitta index på källnoden (source node)
  var sourceIndex = nodes.findIndex(function(node) {
    return node === d.source;
  });
  
  var sourceName = nodes[sourceIndex].name;

  // Hitta namnet på målnoden (target node)
  var targetIndex = nodes.findIndex(function(node) {
    return node === d.target;
  });
  var targetName = nodes[targetIndex].name;

  content += "Source Name: " + sourceName + "<br/>";
  content += "Target Name: " + targetName + "<br/>";
  content += "Value: " + d.value + "<br/>";

  return content;
}

function showTooltip2(d) {
  var tooltip = d3.select("#tooltip");
  tooltip.html(tooltipContent2(d));
  tooltip.style("opacity", 0.9);
}

function showTooltip(d) {
  var tooltip = d3.select("#tooltip");
  tooltip.html(tooltipContent(d));
  tooltip.style("opacity", 0.9);
}

function hideTooltip() {
  var tooltip = d3.select("#tooltip");
  tooltip.style("opacity", 0); // Kan sätta 0 om man vill att rutan ska "försvinna"
}

let zoom = d3.zoom()
.scaleExtent([0.25, 10])
.on('zoom', handleZoom);

function handleZoom(e) {
d3.selectAll('#content1 .nodes circle')
 .attr('transform', e.transform);
 d3.selectAll('#content1 .links')
 .attr('transform', e.transform);
}

function initZoom() {
d3.select('svg')
 .call(zoom);
}

initZoom();