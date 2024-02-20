(async function() {
  let data;
  try {
    data = await d3.json("./data/starwars-full-interactions-allCharacters.json");
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

    console.log(data)
    var simulation = d3.forceSimulation(nodes)
                       .force("charge", d3.forceManyBody().strength(-50))
                       .force("link", d3.forceLink().links(links))
                       .force("center", d3.forceCenter(width / 2, height / 2))
                       .on("tick", ticked);

    function updateLinks() {
                        svg.append("g")
                         d3.selectAll(".links") 
                          .data(links)
                          .append("line")
                          .attr("stroke", "black")
                          .attr("x1", function(d) { return d.source.x; })
                          .attr("y1", function(d) { return d.source.y; })
                          .attr("x2", function(d) { return d.target.x; })
                          .attr("y2", function(d) { return d.target.y; });
                      }
                      
    function updateNodes() {
                        d3.selectAll("circle") 
                          .data(nodes)
                          .join("circle")
                          .attr("r", 5)
                          .attr("fill", "red")
                          .attr("x", function(d) { return d.x; })
                          .attr("y", function(d) { return d.y; });
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
