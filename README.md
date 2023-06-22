# layout README
The action is in index.js, which is written for nodejs, but can be adapted in the browser. The layout calculations depend on nothing, the main function makes use of node's fs module to write the metrics.csv to file.

## What does it do? 
layout/index.js builds a graph from the commands addVertex(), addEdge(a, b), removeVertex(id) and removeEdge(id). Using step, one can gather desired metrics. Currently these are: 
* norm(meanPos(vs)), 
* norm(meanVel(vs)), 
* norm(maxPos(vs)), and
* norm(minPos(vs)),
where vs stands for vertex sample. 

## How to run this? 
For now, just run `node index.js` in the layout folder, after cloning or downloading it. You can observe the console output, inspect metrics.csv, as well as modify the source code (I suggest searching for "main"). 

## Discussion
This is a layout calculation without any sort of optimization. There is no BarnesHute tree to treat geographcially similar objects as the same sum mass, speeding up the calculation. THere is no dynamic matching for the graph, another data structure that groups the graph in a specific way to speed up things. 