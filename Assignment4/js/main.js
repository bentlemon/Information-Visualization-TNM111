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
let select1 = document.createElement("select");
select1.id = "jsonSelect1";

// Add all options to choose from
jsonFiles.forEach(function (file) {
  let option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select1.appendChild(option);
});

document.getElementById("content1").appendChild(select1);

select1.addEventListener("change", async function () {
  let selectedValue = this.value;
  let jsonURL = "./data/" + selectedValue;

  try {
    let data = await d3.json(jsonURL);
    //console.log("Data loaded successfully for content1:", data);

    let width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;
    let selectedRange = [];

    // Calculate the minimum and maximum values in the dataset - links
    let minValue = d3.min(links, d => d.value);
    let maxValue = d3.max(links, d => d.value);


    // Define slider with the calculated min and max values
    let slider = d3
      .sliderBottom()
      .min(minValue)
      .max(maxValue)
      .width(300)
      .ticks(10)
      .default([minValue, maxValue]); // Initial range set to min and max

    // Append the slider to a container
    d3.select("#slider-container")
      .select("svg") // Select existing svg if it exists
      .remove(); // Remove existing svg to update with new slider

    d3.select("#slider-container")
      .append("svg")
      .attr("width", 400)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)")
      .call(slider);

    selectedRange = [minValue, maxValue];
   // updateNodesAndLinks();

    // Listen to slider events
    slider.on("onchange", function (range) {
      // Do something with the selected range
      selectedRange = range;
      updateNodesAndLinks();
    });
         // Konvertera numeriska ID:n till unika ID:n för noderna
         nodes.forEach(function(node, index) {
          node.id = index;
          //console.log(node)
        });
  
        // Konvertera numeriska käll- och målnod-ID:n till unika ID:n för länkarna
        links.forEach(function(link) {
          link.source = nodes[link.source].id;
          link.target = nodes[link.target].id;
        });
  
        // Uppdatera länkar och noder
        updateNodesAndLinks();


    let simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);



      function updateNodesAndLinks() {
        updateLinks();
        updateNodes();
      }

    function updateLinks() {
   // Extract all node IDs
   let allNodeIds = nodes.map(function(d) {
    return d.id;
});

// Filter links based on the selected range
let filteredLinks = links.filter(function(d) {
    return d.value >= selectedRange[0] && d.value <= selectedRange[1] &&
        allNodeIds.includes(d.source.id) && allNodeIds.includes(d.target.id);
});

  // Uppdatera länkarna i SVG
  let linkSelection = d3.select('#content1 .links')
      .selectAll('line')
      .data(filteredLinks, function(d) {return d.source.id + "-" + d.target.id; });

  // Skapa nya länkar för de nya datavärdena
  linkSelection.enter()
      .append('line')
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; })
       
        .on("click", function (event, d) {

          showTooltip2(d);
          d3.select('#content1 .nodes').selectAll('circle')
            .classed("highlighted", function (node) {
              return node === d.source || node === d.target;
            });
        });
        linkSelection.exit().remove();
    }
    



    let tooltipVisible = false; // Variable to track tooltip visibility
    let selectedNode1 = null;

    function updateNodes() {
   

      // --------------------------------------------------------------------------------
   // Extract all node IDs
   let allNodeIds = nodes.map(function(d) {
    return d.id;
});

// Filter links based on the selected range
let filteredLinks = links.filter(function(d) {
    return d.value >= selectedRange[0] && d.value <= selectedRange[1] &&
        allNodeIds.includes(d.source.id) && allNodeIds.includes(d.target.id);
});

// Hämta en lista över ID:n för alla noderna som är kopplade till de kletletande länkarna
let linkedNodeIds = filteredLinks.reduce(function(ids, link) {
    if (!ids.includes(link.source.id)) ids.push(link.source.id);
    if (!ids.includes(link.target.id)) ids.push(link.target.id);
    return ids;
}, []);

// Filtera noderna baserat på om de är anslutna till återstående länkar
let filteredNodes = nodes.filter(function(node) {
    return linkedNodeIds.includes(node.id);
});

// Uppdatera noderna i SVG
let nodeSelection = d3.select('#content1 .nodes')
    .selectAll('circle')
    .data(filteredNodes, function(d) { return d; });

// Skapa nya noder för de nya datavärdena
nodeSelection.enter()
    .append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.value; })
    .attr('fill', function(d) { return d.colour; })
    .attr('opacity', 0.7)
        .on('click', function (event, d) {
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

           let isSelected = d3.select(this).classed("highlighted");
           d3.select(this).classed("highlighted", !isSelected);
           selectedNode1 = this;

           // Node comparison logic
           let nodeName = d.name;
           let nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
           let isNodePresentInContent2 = nodesInContent2.some(function (node) {
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

          // // Update tooltip visibility status
           tooltipVisible = !tooltipVisible;
        })
      // .on("anotherEvent", function (event, d) {
      //   // Always hide the tooltip when anotherEvent occurs
      //   hideTooltip();
      //   // Reset tooltip visibility status
      //   tooltipVisible = false;
      // });
      nodeSelection.exit().remove();
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
let select2 = document.createElement("select");
select2.id = "jsonSelect2";

// Add all options to choose from
jsonFiles.forEach(function (file) {
  let option = document.createElement("option");
  option.value = file.url;
  option.text = file.name;
  select2.appendChild(option);
});

document.getElementById("content2").appendChild(select2);

select2.addEventListener("change", async function () {
  let selectedValue = this.value;
  let jsonURL = "./data/" + selectedValue;

  try {
    let data = await d3.json(jsonURL);
    //console.log("Data loaded successfully for content2:", data);

    let width = 450, height = 340;
    let nodes = data.nodes;
    let links = data.links;

    let simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().links(links))
      .on('tick', ticked);

    function updateLinks() {
      let u = d3.select('#content2 .links')
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
  let content = "";
  content += "Name: " + d.name + "<br/>";
  content += "Value: " + d.value + "<br/>";

  let nodeName = d.name;
  let nodesInContent2 = d3.selectAll('#content2 .nodes circle').data();
  let findValueNode = nodesInContent2.find(function (node) {
    return node.name === nodeName;
  });

  if (findValueNode) {
    let content2 = "";
    content2 += "Name: " + d.name + "<br/>";
    content2 += "Value: " + findValueNode.value + "<br/>";
    return content + content2;
  } else {
    return content;
  }
}

function tooltipContent2(d) {
  let content = "";
  let nodes = d3.selectAll('#content1 .nodes circle').data();
  // Hitta index på källnoden (source node)
  let sourceIndex = nodes.findIndex(function (node) {
    return node === d.source;
  });

  let sourceName = nodes[sourceIndex].name;

  // Hitta namnet på målnoden (target node)
  let targetIndex = nodes.findIndex(function (node) {
    return node === d.target;
  });
  let targetName = nodes[targetIndex].name;

  content += "Source Name: " + sourceName + "<br/>";
  content += "Target Name: " + targetName + "<br/>";
  content += "Value: " + d.value + "<br/>";

  return content;
}

function showTooltip2(d) {
  let tooltip = d3.select("#tooltip");
  tooltip.html(tooltipContent2(d));
  tooltip.style("opacity", 0.9);
}

function showTooltip(d) {
  let tooltip = d3.select("#tooltip");
  tooltip.html(tooltipContent(d));
  tooltip.style("opacity", 0.9);
}

function hideTooltip() {
  let tooltip = d3.select("#tooltip");
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