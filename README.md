# layout
[Joshua Moore](mailto:mooreolith@gmail.com)

layout attempts to implement Dr. Todd Veldhuizen's paper (yeah, I know, still!), with a
particular focus on a process for finding good values for the layout simulation. 

I've refactored layout.js into Layout.js, made layout a class instead of a function, and 
factored the MetricsCollector into its own class and file. 

index.js serves as the entry point to the program. 

MetricsCollector is conservative in its default values, assuming you do not want the data, although all the recordable settings can be switched to true, to record them. 

