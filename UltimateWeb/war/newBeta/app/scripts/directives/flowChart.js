/*global d3, _, angular */


'use strict';

angular.module('newBetaApp')
  .directive('flowChart', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch('flowMap', function(newVal){
          if (newVal){
            d3.select('#chart').select('svg').remove();
            var margin = {top: 1, right: 1, bottom: 6, left: 1},
                width = scope.windowWidth  * 0.85,
                height = scope.windowWidth * 0.88;

            var formatNumber = d3.format(',.0f'),
                format = function(d) { return formatNumber(d) + ' Times'; },
                color = d3.scale.category20();

            var svg = d3.select('#chart').append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
              .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var sankey = d3.sankey()
                .nodeWidth(15)
                .nodePadding(10)
                .size([width, height]);

            var path = sankey.link();

            sankey
                .nodes(scope.flowMap.nodes)
                .links(scope.flowMap.links)
                .layout(32);

            var link = svg.append('g').selectAll('.link')
                .data(scope.flowMap.links)
              .enter().append('path')
                .attr('class', 'link')
                .attr('d', path)
                .style('stroke-width', function(d) { return Math.max(1, d.dy); })
                .sort(function(a, b) { return b.dy - a.dy; });

            link.append('title')
                .text(function(d) { return d.source.name.slice(0,d.source.name.length-1) + ' → ' + d.target.name.slice(0,d.target.name.length-1) + '\n' + format(d.value); });

            var node = svg.append('g').selectAll('.node')
                .data(scope.flowMap.nodes)
              .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
              .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on('dragstart', function() { this.parentNode.appendChild(this); })
                .on('drag', dragmove));

            node.append('rect')
                .attr('height', function(d) { return d.dy; })
                .attr('width', sankey.nodeWidth())
                .style('fill', function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
                .style('stroke', function(d) { return d3.rgb(d.color).darker(2); })
              .append('title')
                .text(function(d) { return d.name + '\n' + format(d.value); });

            node.append('text')
                .attr('x', -6)
                .attr('y', function(d) { return d.dy / 2; })
                .attr('dy', '.35em')
                .attr('text-anchor', 'end')
                .attr('transform', null)
                .text(function(d) { return d.name.substring(0, d.name.length - 1); })
              .filter(function(d) { return d.x < width / 2; })
                .attr('x', 6 + sankey.nodeWidth())
                .attr('text-anchor', 'start');

          }
          function dragmove(d) {
            d3.select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ')');
            sankey.relayout();
            link.attr('d', path);
          }
        });
      }
    };
  });
