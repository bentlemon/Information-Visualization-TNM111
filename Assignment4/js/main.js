
//let data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json").catch(function(error){ console.log(error)});
(async function() {let RawEp;
  try {
   RawEp = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json").catch(function (error) {
      console.error("Error loading data:", error);
    });
    console.log(RawEp)

  } catch (error) {
    console.error("Error loading data:", error);
  }
  try {
    let data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json");
   
    console.log("hej")

    function createNetworkDiagram(data) {
      var width = 600;
      var height = 400;

      let nodes = data.nodes;
      let links = data.links;

      var svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

      var simulation = d3.forceSimulation(nodes)
                         .force("charge", d3.forceManyBody().strength(-50))
                         .force("link", d3.forceLink().links(links))
                         .force("center", d3.forceCenter(width / 2, height / 2))
                         .on("tick", ticked);

      // Funktion för att uppdatera länkarna
      function updateLinks() {
       d3.select(".links")
            .data(data.links)
            .join("line")
            .attr("x1", function(d){
              return d.source.x
            })
            .attr("y1", function(d){
              return d.source.y
            })
            .attr("x2", function(d){  // Fix: Should be "x2" instead of "x1"
              return d.target.x
            })
            .attr("y2", function(d){
              return d.target.y
            });
      }

      // Funktion för att uppdatera noderna
      function updateNodes() {
          u = d3.select(".nodes")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .text(function(d) {
              return d.x
            })
            .attr("x", function(d){
              return d.x
            })
            .attr("y", function(d){
              return 5
            });
      }

      // Funktion som anropas vid varje tick av simuleringen
      function ticked() {
        updateLinks();
        updateNodes();
      }

      return svg.node(); // Return the SVG node
    }

    var networkDiagram = createNetworkDiagram(data);
    document.getElementById("visualization").appendChild(networkDiagram);
  } catch (error) {
    console.log(error);
  }
})();


