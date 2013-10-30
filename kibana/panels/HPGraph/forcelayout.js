function menu_forcelayout(w,h,gnodes,glinks,divname){  
        //alert(gnodes.length);
        var root = {'nodes':gnodes,'links':glinks},
            width = w,
	    height = h;               
	    root.fixed = true;                           
            links = root.links;
            nodes = root.nodes;
     
         // make it so we can lookup nodes in O(1):
         
                 var hash_lookup = [];
                 nodes.forEach(function(d, i) {
                  hash_lookup[d._id] = d;
                  });
                  links.forEach(function(d, i) {
                   d.source = hash_lookup[d.source];
                   d.target = hash_lookup[d.target];
                  });


         var force = d3.layout.force()
			.on("tick", tick)
			.charge(-15)               // dense 
			.linkDistance(35)          // link's distance
			.size([width, height])                        
                        .nodes(nodes)
                        .links(links)
                        .start();
                // show space
		var svg = d3.select("div."+divname).append("svg:svg")
			.attr("width", width)
			.attr("height", height);
                // arrow configure 
                svg.append("svg:defs").selectAll("marker")
                   .data(["suit","licensing","resolved"])  //line type
                   .enter().append("svg:marker")
                   .attr("id",String)
                   .attr("viewBox","0 -5 10 10") 
                   .attr("refX", 20)           //position 
                   .attr("refY", 0)            //position
                   .attr("markerWidth",3)      //size 
                   .attr("markerHeight",3)     //size 
                   .attr("orient","auto")
                  .append("svg:path")
                   .attr("d","M0,-5L10,0L0,5");
                //line configure
		var path = svg.append("svg:g").selectAll("path")
		    .data(force.links())
		    .enter().append("svg:path")
                    .attr("class", function(d) { return "link " + d.type; })
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
                  
          
                //node configure
                var circle = svg.append("svg:g").selectAll("a.circle")
                .data(force.nodes())                
                .enter().append("a")
                .attr("class", "circle")
                .call(force.drag);
                 circle.append("circle")
                       .style("stroke","black")
                       .style("stroke-width",function(d){if(d.stroke==1){return 2;} else{return 0;}})
                       .style("fill",color) 
                       .attr("r", function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){ return 0;}
                                               else{ return 4;} });
                 //IMG
                  circle.append("svg:image")                     
                     .attr("xlink:href", function(d){ if(d.group ==4){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif1.png";}
                                                      else if(d.group ==5){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif2.png";}
                                                      else if(d.group ==6){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif3.png";}
                                                      else if(d.group ==7){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif4.png";}
                                                      else if(d.group ==8){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention1.png";}
                                                      else if(d.group ==9){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention2.png";}
                                                      else if(d.group ==10){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention3.png";}
                                                      else if(d.group ==11){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention4.png";}
                                                      else if(d.group ==12){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention5.png";} 
                                                    })
                     .attr("x",function(d){ var a= Math.sqrt(d.size/3)*1.2; a=a/2; return -a  ;} )
                     .attr("y",function(d){ var a= Math.sqrt(d.size/3)*1.2; a=a/2; return -a  ;} )
                     .attr("width", function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){return Math.sqrt(d.size/4)*1.2;}else{return 0 ;}})
                     .attr("height",function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){return Math.sqrt(d.size/4)*1.2;}else{return 0 ;}});                              



                  //node's title
                  circle.append("title")
	               	.text(function(d) {
                           var d = this.__data__;
                           var description;
                           if (d.group == 1) {
                           description = 'Hostname : ';
                           return description +d.name +'\n'+' geocode:'+d.geocode+'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 2) {
                            description = 'URL : ';
                                                    if(typeof(d.classification)=="undefined"){
                                                               return description +d.name +'\n'+'  id:'+d._id ;
                                                                                     }
                                                    else{ return description +d.name +'\n'+' classification:'+d.classification+'\n'+' rule:'+d.rule+'\n'+'  id:'+d._id ; }
                           }
                           else if (d.group == 3) {
                           description = 'MD5 : ';
                           return description +d.name +'\n'+' File type:'+d.md5_type+'\n'+'  id:'+d._id ;      
                           }
                           else if (d.group == 4) {
                           description = 'Motif1 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;
                           }
                           else if (d.group == 5) {
                           description = 'Motif2 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;

                           }
                           else if (d.group == 6) {
                           description = 'Motif3 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;

                           }
                           else if (d.group == 7) {
                           description = 'Motif4 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;

                           }
                           else if (d.group == 8) {
                           description = 'Intention1 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 9) {
                           description = 'Intention2 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 10) {
                           description = 'Intention3 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 11) {
                           description = 'Intention4 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 12) {
                           description = 'Intention5: ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else{ 
                           description = 'Undefined : '; 
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }         
                           });


                var text = svg.append("svg:g").selectAll("g")
                     .data(force.nodes())
                     .enter().append("svg:g");
                  
                

// Use elliptical arc path segments to doubly-encode directionality.                       
function tick() {
        //line's position
        path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        // line's Radian
        dr = 0;
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });                      
        circle.attr("transform", function(d) {
                     return "translate(" + d.x + "," + d.y + ")";
                         });
                      }          
            
//node's color by group 1:HOST 2:URL 3:MD5




function color(d) {
    if (d.group == 1) {
        return "#19FF1C";
    }
    else if (d.group == 2) {
        return "#FFB6C1";
    }
    else if (d.group == 3) {
        return "#0000FF";
    }
    else if (d.group ==4 |d.group ==5|d.group ==6|d.group ==7) {
        return "#A0009E"; 
    }
    else if (d.group == 8) {
        return "#050505"; 
    }
    else if (d.group == 9) {
        return "#EE0000";
    }
    else if (d.group == 10) {
        return "#050505";
    }
    else
        return "#EE0000";
}

}



function forcelayout(w,h,gnodes,glinks,divname){  
        //alert(gnodes.length);
        var root = {'nodes':gnodes,'links':glinks},
            width = w,
	    height = h;               
	    root.fixed = true;                           
            links = root.links;
            nodes = root.nodes;
     
         // make it so we can lookup nodes in O(1):
         
                 var hash_lookup = [];
                 nodes.forEach(function(d, i) {
                  hash_lookup[d._id] = d;
                  });
                  links.forEach(function(d, i) {
                   d.source = hash_lookup[d.source];
                   d.target = hash_lookup[d.target];
                  });


         var force = d3.layout.force()
			.on("tick", tick)
			.charge(-15)               // dense 
			.linkDistance(35)          // link's distance
			.size([width, height])                        
                        .nodes(nodes)
                        .links(links)
                        .start();
                // show space
		var svg = d3.select("div."+divname).append("svg:svg")
			.attr("width", width)
			.attr("height", height);
                // arrow configure 
                svg.append("svg:defs").selectAll("marker")
                   .data(["suit","licensing","resolved"])  //line type
                   .enter().append("svg:marker")
                   .attr("id",String)
                   .attr("viewBox","0 -5 10 10") 
                   .attr("refX", 20)           //position 
                   .attr("refY", 0)            //position
                   .attr("markerWidth",3)      //size 
                   .attr("markerHeight",3)     //size 
                   .attr("orient","auto")
                  .append("svg:path")
                   .attr("d","M0,-5L10,0L0,5");
                //line configure
		var path = svg.append("svg:g").selectAll("path")
		    .data(force.links())
		    .enter().append("svg:path")
                    .attr("class", function(d) { return "link " + d.type; })
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
                  
          
                //node configure
                var circle = svg.append("svg:g").selectAll("a.circle")
                .data(force.nodes())                
                .enter().append("a")
                .attr("class", "circle")
                .call(force.drag)
                .on('selectstart',"false")
                .on('contextmenu',function(d){
                                              document.getElementById('menu_graph').innerHTML=""; 
                                              var rjson = {
                                                        "graph": {
                                                        "mode":"NORMAL",
                                                        "vertices":node_table,
                                                        "edges": edge_table }
                                                                             };
                                              var g = new Helios.GraphDatabase();
                                                  g.loadGraphSON(rjson);
                                              if(divname=='Stage31'|divname=='Stage1'|divname=='Stage2'){ 
                                                  g.v(d['_id']).then(function(result){ 
                                                                    var nodes=result;
                                                                    nodes[0]['stroke']=1;
                                                                    var adj_id=[];
                                                                     g.v(d['_id']).both().then(function(result){
                                                                         for(i=0;i<result.length;i++){
                                                                             if(result[i]['group']==1|result[i]['group']==2|result[i]['group']==3){
                                                                                 var nodes_infor = add_node(result[i],nodes,'right_button');  
                                                                                 nodes = nodes_infor[0] ;
                                                                                 //nodes.push(result[i]);
                                                                                 adj_id.push(result[i]['_id']);
                                                                                                                                                  } 
                                                                                                     }   
                                                                     g.v(adj_id).both().then(function(result){
                                                                           for(i=0;i<result.length;i++){
                                                                               if(result[i]['_id']!=d['_id']){
                                                                                  if(result[i]['group']==1|result[i]['group']==2|result[i]['group']==3){
                                                                                    nodes_infor = add_node(result[i],nodes,'right_button');
                                                                                    nodes = nodes_infor[0] ; 
                                                                                     // nodes.push(result[i]);
                                                                                                                                                        }
                                                                                                             }
                                                                               }  
                                                                     g.v(d['_id']).bothE().where({ori:{$eq:1}}).then(function(result){ 
                                                                     var links=result;
                                                                      g.v(adj_id).bothE().where({ori:{$eq:1}}).then(function(result){ 
                                                                             
                                                                             for(i=0;i<result.length;i++){
                                                                               links.push(result[i]);
                                                                               }
                                                                     links = d3link_converter(links);               
                                                                     menu_forcelayout(300,300,nodes,links,'menu_graph');
                                                                     });
                                                                      });
                                                                     });
                                                                     });
                                                                     });
                                                   showmenu(d,0)                  
                                                                                      }
                                                  else if(divname=='Stage32'){
                                                    if(d['group']==1|d['group']==2|d['group']==3){
                                                    g.v(d['_id']).then(function(result){
                                                                    var nodes=result;
                                                                    nodes[0]['stroke']=1; 
                                                                    var adj_id=[];
                                                                     g.v(d['_id']).both().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                         for(i=0;i<result.length;i++){
                                                                                 nodes_infor = add_node(result[i],nodes,'right_button');
                                                                                 nodes = nodes_infor[0] ;
                                                                                 adj_id.push(result[i]['_id']);
                                                                                 }
                                                                     g.v(adj_id).both().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                           for(i=0;i<result.length;i++){
                                                                               if(result[i]['_id']!=d['_id']){
                                                                                   nodes_infor = add_node(result[i],nodes,'right_button');
                                                                                   nodes = nodes_infor[0] ;
                                                                                                             } 
                                                                               }
                                                                     g.v(d['_id']).bothE().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                     var links=result;
                                                                      g.v(adj_id).bothE().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){

                                                                             for(i=0;i<result.length;i++){
                                                                               links.push(result[i]);
                                                                               }
                                                                     links = d3link_converter(links);
                                                                     menu_forcelayout(300,300,nodes,links,'menu_graph');
                                                                     });
                                                                      });
                                                                     });
                                                                     });
                                                                     });
                                                                                                }
                                                     else{    
                                                              var motif_id=[];
                                                              var d_json = d.name.replace(/}/g,"}},");
                                                              d_json =d_json.substring(0,d_json.length-2);                                                                
                                                              d_json = d_json.split("},");
                                                              for(i=0;i<d_json.length;i++){         
                                                              var tem_json = JSON.parse(d_json[i]);
                                                                 motif_id.push(tem_json['_id']);                                                                
                                                                                          }
                                                              g.v(motif_id).then(function(result){   
                                                                  //nodes_id = motif_id;
                                                                  nodes=result;
                                                                  g.v(motif_id).both().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){ 
                                                                     for(i=0;i<result.length;i++){   
                                                                               nodes_infor = add_node(result[i],nodes,'right_button');
                                                                               nodes = nodes_infor[0] ;                                                                                                                                                                                                                  }
                                                              g.v(motif_id).bothE().where({motif_reduce:{$eq:1}}).then(function(result){ 

                                                                  links = result;
                                                                  links = d3link_converter(links); 
                                                                  console.log(JSON.stringify(links));
                                                                  menu_forcelayout(300,300,nodes,links,'menu_graph');    
                                                                  //showmenu(d,1);                                                      
                                                                                                                                        });                       
                                                                                                                                                                }); 
                                                                                                 });
                                                           
                                                         }
                                                       showmenu(d,1);
                                                   } 
                                                   else if(divname=='Stage4'){
                                                         if(d['group']==1){
                                                         g.v(d['_id']).then(function(result){
                                                                    var nodes=result;
                                                                    nodes[0]['stroke']=1;
                                                                    var adj_id=[];
                                                                     g.v(d['_id']).both().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                         for(i=0;i<result.length;i++){
                                                                                 nodes_infor = add_node(result[i],nodes,'right_button');
                                                                                 nodes = nodes_infor[0] ;
                                                                                 adj_id.push(result[i]['_id']);
                                                                                 }
                                                                     g.v(adj_id).both().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                           for(i=0;i<result.length;i++){
                                                                               if(result[i]['_id']!=d['_id']){
                                                                                   nodes_infor = add_node(result[i],nodes,'right_button');
                                                                                   nodes = nodes_infor[0] ;
                                                                                                             }
                                                                               }
                                                                     g.v(d['_id']).bothE().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
                                                                     var links=result;
                                                                      g.v(adj_id).bothE().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){

                                                                             for(i=0;i<result.length;i++){
                                                                               links.push(result[i]);
                                                                               }
                                                                     links = d3link_converter(links);
                                                                     menu_forcelayout(300,300,nodes,links,'menu_graph');
                                                                     });
                                                                      });
                                                                     });
                                                                     });
                                                                     });
                                                                                                }
                                                           showmenu(d,0);
                                                                          }
                                                   else{ }
                                                         });       

                 circle.append("circle")
                       .style("stroke","#FF0000")
                       .style("stroke-width",function(d){if(d.stroke==1){return 1.5;} else{return 0;}})
                       .style("fill",color) 
                       .attr("r", function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){ return 0;}
                                               else{ return 4;} });
                 
                              

               circle.append("svg:image")                     
                     .attr("xlink:href", function(d){ if(d.group ==4){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif1.png";}
                                                      else if(d.group ==5){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif2.png";}
                                                      else if(d.group ==6){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif3.png";}
                                                      else if(d.group ==7){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Motif4.png";}
                                                      else if(d.group ==8){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention1.png";}
                                                      else if(d.group ==9){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention2.png";}
                                                      else if(d.group ==10){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention3.png";}
                                                      else if(d.group ==11){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention4.png";}
                                                      else if(d.group ==12){return "http://140.116.163.148/kibana/panels/HPGraph/picture/Intention5.png";} 
                                                    })
                     .attr("x",function(d){ var a= Math.sqrt(d.size/3)*1.2; a=a/2; return -a  ;} )
                     .attr("y",function(d){ var a= Math.sqrt(d.size/3)*1.2; a=a/2; return -a  ;} )
                     .attr("width", function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){return Math.sqrt(d.size/4)*1.2;}else{return 0 ;}})
                     .attr("height",function(d){ if(d.group ==4 |d.group ==5|d.group ==6|d.group ==7|d.group ==8|d.group ==9|d.group ==10|d.group ==11|d.group ==12){return Math.sqrt(d.size/4)*1.2;}else{return 0 ;}});
                  //node's title
                    circle.append("title")
                          .text(function(d) {
                           var d = this.__data__;
                           var description;
                           if (d.group == 1) {
                           description = 'Hostname : ';
                           return description +d.name +'\n'+' geocode:'+d.geocode+'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 2) {
                           description = 'URL : ';
                                                    if(typeof(d.classification)=="undefined"){
                                                               return description +d.name +'\n'+'  id:'+d._id ; 
                                                                                     }
                                                    else{ return description +d.name +'\n'+' classification:'+d.classification+'\n'+' rule:'+d.rule+'  id:'+d._id ; }
                        
                           }
                           else if (d.group == 3) {
                           description = 'MD5 : ';
                           return description +d.name +'\n'+' File type:'+d.md5_type+'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 4) {
                           description = 'Motif1 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;
                           }
                           else if (d.group == 5) {
                           description = 'Motif2 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;
                           //return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 6) {
                           description = 'Motif3 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ; 
                           //return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 7) {
                           description = 'Motif4 : '+'\n';
                           var d_json = d.name.replace(/}/g,"}},");
                               d_json =d_json.substring(0,d_json.length-2);
                               d_json = d_json.split("},");
                               for(i=0;i<d_json.length;i++){
                                   var tem_json = JSON.parse(d_json[i]);
                                         description+= tem_json['name'] + '\n';
                                                           }
                           return description +'  id:'+d._id ;
                           //return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 8) {
                           description = 'Intention1 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 9) {
                           description = 'Intention2 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 10) {
                           description = 'Intention3 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 11) {
                           description = 'Intention4 : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 12) {
                           description = 'Intention5: ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else{
                           description = 'Undefined : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           });


                var text = svg.append("svg:g").selectAll("g")
                     .data(force.nodes())
                     .enter().append("svg:g");
                  
                

// Use elliptical arc path segments to doubly-encode directionality.                       
function tick() {
        //line's position
        path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        // line's Radian
        dr = 0;
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });                      
        circle.attr("transform", function(d) {
                     return "translate(" + d.x + "," + d.y + ")";
                         });
                      }          
            
//node's color by group 1:HOST 2:URL 3:MD5
function color(d) {
    if (d.group == 1) {
        return "#19FF1C";
    }
    else if (d.group == 2) {
        return "#FFB6C1";
    }
    else if (d.group == 3) {
        return "#0000FF";
    }
    else if (d.group ==4 |d.group ==5|d.group ==6|d.group ==7) {
        return "#A0009E"; 
    }
    else if (d.group == 8) {
        return "#050505"; 
    }
    else if (d.group == 9) {
        return "#EE0000";
    }
    else if (d.group == 10) {
        return "#050505";
    }
    else
        return "#EE0000";
//  return d._group ? "#00ee00" : d.children ? "#000000" : "#0000ee";


}
}




function mal_forcelayout(w,h,gnodes,glinks,divname){  
        //alert(gnodes.length);
        var root = {'nodes':gnodes,'links':glinks},
            width = w,
	    height = h;               
	    root.fixed = true;                           
            links = root.links;
            nodes = root.nodes;
     
         // make it so we can lookup nodes in O(1):
         
                 var hash_lookup = [];
                 nodes.forEach(function(d, i) {
                  hash_lookup[d._id] = d;
                  });
                  links.forEach(function(d, i) {
                   d.source = hash_lookup[d.source];
                   d.target = hash_lookup[d.target];
                  });


         var force = d3.layout.force()
			.on("tick", tick)
			.charge(-35)               // dense 
			.linkDistance(50)          // link's distance
			.size([width, height])                        
                        .nodes(nodes)
                        .links(links)
                        .start();
                // show space
		var svg = d3.select("div."+divname).append("svg:svg")
			.attr("width", width)
			.attr("height", height);
                // arrow configure 
                svg.append("svg:defs").selectAll("marker")
                   .data(["suit","licensing","resolved"])  //line type
                   .enter().append("svg:marker")
                   .attr("id",String)
                   .attr("viewBox","0 -5 10 10") 
                   .attr("refX", 20)           //position 
                   .attr("refY", 0)            //position
                   .attr("markerWidth",3)      //size 
                   .attr("markerHeight",3)     //size 
                   .attr("orient","auto")
                  .append("svg:path")
                   .attr("d","M0,-5L10,0L0,5");
                //line configure
		var path = svg.append("svg:g").selectAll("path")
		    .data(force.links())
		    .enter().append("svg:path")
                    .attr("class", function(d) { return "link " + d.type; })
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
                  
          
                //node configure
                var circle = svg.append("svg:g").selectAll("a.circle")
                .data(force.nodes())                
                .enter().append("a")
                .attr("class", "circle")
                .call(force.drag);
                 circle.append("circle")
                       .style("fill",color) 
                       .attr("r", 4)
                 
                              
                  //node's title
                  circle.append("title")
	               	.text(function(d) {
                           var d = this.__data__;
                           var description;
                           if (d.group == 1) {
                           description = 'Hostname : ';
                           return description +d.name +'\n'+' geocode:'+d.geocode+'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 2) {
                           description = 'Country : ';         
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 3) {
                           description = 'MD5 : ';
                           return description +d.name +'\n'+' type:'+d.md5_type+'\n'+'  id:'+d._id ;      
                           }
                           else if (d.group == 4) {
                           description = 'THUG : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else if (d.group == 5) {
                           description = 'FileType : ';
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }
                           else{ 
                           description = 'Undefined : '; 
                           return description +d.name +'\n'+'  id:'+d._id ;
                           }         
                           });


                var text = svg.append("svg:g").selectAll("g")
                     .data(force.nodes())
                     .enter().append("svg:g");
                  
                

// Use elliptical arc path segments to doubly-encode directionality.                       
function tick() {
        //line's position
        path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        // line's Radian
        dr = 0;
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });                      
        circle.attr("transform", function(d) {
                     return "translate(" + d.x + "," + d.y + ")";
                         });
                      }          
            
//node's color by group 1:HOST 2:URL 3:MD5
function color(d) {
    if (d.group == 1) {
        return "#19FF1C";    //#2F4F4F
    }
    else if (d.group == 2) {
        return "#FFB6C1";
    }
    else if (d.group == 3) {
        return "#0000FF";
    }
    else if (d.group == 4) {
        return "#050505";
    }
    else if (d.group == 5) {
        return "#CAFF70";
    }

    else
        return "#EE0000";
//  return d._group ? "#00ee00" : d.children ? "#000000" : "#0000ee";


}
}

