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
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select1.appendChild(option);
});

document.getElementById("content1").appendChild(select1);

select1.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully for content1:", data);

    var width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

      function updateLinks() {
        var u = d3.select('#content1 .links')
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('x1', function(d) { return d.source.x })
          .attr('y1', function(d) { return d.source.y })
          .attr('x2', function(d) { return d.target.x })
          .attr('y2', function(d) { return d.target.y })
          .on("click", function(event, d) {
            var sourceNode = d.source;
            var targetNode = d.target;
            showTooltip2(d);
            d3.select('#content1 .nodes').selectAll('circle')
              .classed("highlighted", function(node) {
                
                return node === sourceNode || node === targetNode;
              });
            
          });
      }
      

    var selectedNode1 = null;
    function updateNodes() {
      d3.select('#content1 .nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        .on("click", function(event, d) {
          showTooltip(d);
          if (selectedNode1 !== null && selectedNode1 !== this) {
            d3.select(selectedNode1).classed("highlighted", false);
          }
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode1 = this;
    
          // Jämför den markerade noden med alla noder i content2
          var nodeName = d.name;
          var nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
          var isNodePresentInContent2 = nodesInContent2.some(function(node) {
            return node.name === nodeName;
          });
          if (isNodePresentInContent2 !== null && isNodePresentInContent2 !== this) {
            d3.selectAll('#content2 .nodes circle')
              .classed("highlighted", false);
          }
          {
            // Om noden finns i content2, markera den
            d3.selectAll('#content2 .nodes circle')
              .classed("highlighted", function(node) {
                return node.name === nodeName;
              });
          }
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        });
    }   

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content1:", error);
  }
});

// Dropdown menu for content2
var select2 = document.createElement("select");
select2.id = "jsonSelect2";

// Add all options to choose from
jsonFiles.forEach(function(file) {
  var option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select2.appendChild(option);
});

document.getElementById("content2").appendChild(select2);

select2.addEventListener("change", async function() {
  var selectedValue = this.value;
  var jsonURL = "./data/" + selectedValue;

  try {
    var data = await d3.json(jsonURL);
    console.log("Data loaded successfully for content2:", data);

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
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });
    }

    var selectedNode2 = null;
    function updateNodes() {
      d3.select('#content2 .nodes')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) { return d.colour; })
        .attr("opacity", 0.7)
        // Detta behöver inte vara med om vi inte vill att diagram 2 också ska vara interaktivt
       /* .on("mouseover", function(event, d) {
          showTooltip(d);
          if (selectedNode2 !== null && selectedNode2 !== this) {
            d3.select(selectedNode2).classed("highlighted", false);
          }
          var isSelected = d3.select(this).classed("highlighted");
          d3.select(this).classed("highlighted", !isSelected);
          selectedNode2 = this;
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        });*/
    }

    function ticked() {
      updateLinks();
      updateNodes();
    }

  } catch (error) {
    console.error("Error loading data for content2:", error);
  }
});

function tooltipContent(d) {
  var content = "";
  content += "Name: " + d.name + "<br/>";
  content += "Value: " + d.value + "<br/>";

  var nodeName = d.name;
  var nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
  var findValueNode = nodesInContent2.find(function(node) {
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
  // Hitta namnet på källnoden (source node)
  var sourceIndex = nodes.findIndex(function(node) {
    return node === d.source;
  });
  
 // var nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
  //var sourceName = nodes[sourceIndex].name;

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