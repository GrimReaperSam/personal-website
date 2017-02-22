$(document).ready(function() {

  ///////////////////////////
  // SETUP VARIABLES START //
  ///////////////////////////
  var word = "Hello World!";
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  var fontFamily = "'open_sansbold',Arial,sans-serif";
  var nonMatchColor = "#85878b";
  var matchColor = "#ffffff";
  var nonMatchBgnd = "#33373d";
  var matchBgnd = "#558e6a";
  var splitColor = "#cd5353";
  var width = 50;
  var height = 20;

  var randomWord = function() {
    var rdWord = '';
    _(word.length).times(function(idx)  {
      rdWord += charset.charAt(Math.floor(Math.random() * charset.length))
    });
    return rdWord;
  }

  var fitness = function(candidate) {
    var fitness = 0;

    var i;
    for (i = 0;i < word.length; ++i) {
      if (word[i] == candidate[i]) {
          fitness += 1;
      }
      fitness += (127 - Math.abs(word.charCodeAt(i) - candidate.charCodeAt(i))) / 127;
    }

    return Math.round(fitness * 100) / 100;
  }

  var setText = function(chromosome, text) {
    chromosome.textattr("font-family", "'open_sansbold',Arial,sans-serif");
    chromosome.textattr("fill", nonMatchColor);
    chromosome.rectattr("fill", nonMatchBgnd);

    _(word.length).times(function(idx) {
      chromosome.setText(text[idx], idx);
      if (text[idx] === word.charAt(idx)) {
        chromosome.textattr("fill", matchColor, idx);
        chromosome.rectattr("fill", matchBgnd, idx);
      }
    })
  }
  /////////////////////////
  // SETUP VARIABLES END //
  /////////////////////////

  //////////////////////////////
  // POPULATION EXAMPLE START //
  //////////////////////////////
  var svg = d3.select("#population-example").append("svg")
    .attr("viewBox", `0 0 ${(width + 1) * word.length} ${(height + 5) * 4}`);

  _(4).times(function(index) {
    var dims = {"x": 0, "y": (height + 5) * index, "width": width, "height": height};
    var populationChr = new Chromosome(svg, word.length, dims);
    setText(populationChr, randomWord());
  });
  ////////////////////////////
  // POPULATION EXAMPLE END //
  ////////////////////////////


  //////////////////////////////
  // MATCHING 5 EXAMPLE START //
  //////////////////////////////
  var svg = d3.select("#matching-five-example").append("svg")
    .attr("viewBox", `0 0 ${(width + 1) * word.length} ${height}`);
  var matchSix = "H.plo!LoAndi";

  var dims = {"x": 0, "y": 0, "width": width, "height": height};
  var matchingFiveChr = new Chromosome(svg, word.length, dims);
  setText(matchingFiveChr, matchSix);

  $('#matching-five-fitness').text(fitness(word, matchSix));
  $('#worle-fitness').text(fitness(word, "Hello Worle!"));
  $('#worly-fitness').text(fitness(word, "Hello Worly!"));
  ////////////////////////////
  // MATCHING 5 EXAMPLE END //
  ////////////////////////////


  /////////////////////////////
  // CROSSOVER EXAMPLE START //
  /////////////////////////////
  var distance = 30;
  var svg = d3.select("#crossover-example").append("svg")
    .attr("viewBox", `0 0 ${(width + 1) * word.length} ${height * 4 + distance * 4}`);
  var dad = "Halli Bored!";
  var mom = "Peibo Random";

  var dims = {"x": 0, "y": 0, "width": width, "height": height};
  var dadChr = new Chromosome(svg, word.length, dims)
  setText(dadChr, dad);

  var dims = {"x": 0, "y": distance + height, "width": width, "height": height};
  var momChr = new Chromosome(svg, word.length, dims)
  setText(momChr, mom);

  // SINGLE POINT CROSSOVER //
  var crossoverPoint = Math.floor(Math.random() * (word.length - 4)) + 2
  svg.append("line")
    .attr("stroke", splitColor)
    .attr("stroke-width", 2)
    .attr("x1", (width + 1) * crossoverPoint)
    .attr("y1", 0)
    .attr("x2", (width + 1) * crossoverPoint)
    .attr("y2", distance + height * 2);

  var firstChild = function() {
    _.each(_.range(crossoverPoint), function(i) {
      dadChr.getGene(i)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("transform", `translate(0, ${(height + distance) * 2 + distance})`)
        .on("end", function() {
          momChr.getGene(i)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("transform", `translate(0, ${height + distance * 2})`);
        });
    });
  }
  // firstChild();
  var secondChild = function() {
    _.each(_.range(crossoverPoint, word.length), function(i) {
      dadChr.getGene(i)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("transform", `translate(0, ${(height + distance) * 3 + distance})`)
        .on("end", function() {
          momChr.getGene(i)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("transform", `translate(0, ${(height + distance) * 2 + distance })`)
            .on("end", function() {
              secondChild();
            });
        });
    });
  };

  /////////////////////////////
  // CROSSOVER 5 EXAMPLE END //
  /////////////////////////////
});




// var repeat = function() {
//   chr.getGene(1)
//   .transition()
//   .duration(2000)
//   .ease(d3.easeLinear)
//   .attr("transform", "translate(0, 50)")
//   .on("end", function() {
//     chr.getGene(1)
//     .transition()
//     .duration(2000)
//     .ease(d3.easeLinear)
//     .attr("transform", "translate(0, 0)")
//     .on("end", repeat);
//   });
// }
// repeat();