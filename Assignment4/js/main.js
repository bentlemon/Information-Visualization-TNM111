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
// Lägger till alla alternativ att välja emellan
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
    // Här kan du göra vad du vill med den laddade datan



/*(async function() {
  let data;
  try {
    data = await d3.json("./data/starwars-episode-1-interactions-allCharacters.json");
  } catch (error) {
    console.error("Error loading data:", error);
    return; // Exit function if data loading fails
  }*/


 /* const contentDiv = document.getElementById("visualization");

  const width = contentDiv.clientWidth;
  const height = contentDiv.clientHeight;*/

  var width = 450, height = 340

  let nodes = data.nodes;
  let links = data.links;

  var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);
  
  function updateLinks() {
    var u = d3.select('.links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      });
  }
  
  function updateNodes() {
    var u = d3.select('.nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', function(d) { return d.x; }) // x-koordinat
      .attr('cy', function(d) { return d.y; }) // y-koordinat
      .attr("r", function(d) { return d.value; }) // radie baserat på "value"
      .attr("fill", function(d) { return d.colour; })
      .attr("opacity", 0.7);
  }
 
  function ticked() {
    updateLinks()
    updateNodes()
  }
  
} catch (error) {
  console.error("Error loading data:", error);
};

})();


