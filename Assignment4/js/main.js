(async function() {
  let data;
  try {
    data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json");
  } catch (error) {
    console.error("Error loading data:", error);
    return; // Exit function if data loading fails
  }

  function createNetworkDiagram(data) {
  const contentDiv = document.getElementById("visualization");

  const width = contentDiv.clientWidth;
  const height = contentDiv.clientHeight;

    var svg = d3.select("#visualization")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    var nodes = data.nodes;
    var links = data.links;

    var simulation = d3.forceSimulation(nodes)
                       .force("charge", d3.forceManyBody().strength(-50))
                       .force("link", d3.forceLink().links(links))
                       .force("center", d3.forceCenter(width / 2, height / 2))
                       .on("tick", ticked);


    function updateLinks() {
                        svg.selectAll(".link")
                           .data(links)
                           .join("line")
                           .attr("class", "link")
                           .attr("stroke", "black")
                           .attr("x1", function(d) { return d.source.x; })
                           .attr("y1", function(d) { return d.source.y; })
                           .attr("x2", function(d) { return d.target.x; })
                           .attr("y2", function(d) { return d.target.y; });
                      }
                  
    function updateNodes() {
                        svg.selectAll("circle")
                           .data(nodes)
                           .join("circle")
                           .attr("class", "node")
                           .attr("r", function(d) { return d.value; }) // Använd 'value' för att sätta storleken på noderna
                           .attr("fill", function(d) { return d.colour; }) // Använd 'colour' för att sätta färgen på noderna
                           .attr("cx", function(d) { return d.x; })
                           .attr("cy", function(d) { return d.y; });

    }

    function ticked() {
   
      updateLinks();
      updateNodes();
     
    }
    return svg.node();
 
  }

  var networkDiagram = createNetworkDiagram(data);
  document.getElementById("visualization").appendChild(networkDiagram);
})();
