function adjacent_nodes(g,start_node,adjnode_check,connect_nodes,distribution_nodes,connect_table,callback,callback2,callback3){
var adj_nodes=[];   
g.v(start_node).both().then(function(result){
                              if(result.length==0){
                                        null;
                                                  }
                              else{
                              for(var i=0;i<result.length;i++){
                                  adj_nodes.push(result[i]['_id']);
                                                             }
                                  }
                              for(i=0;i<adj_nodes.length;i++){
                              var dirty1 = adjnode_check.indexOf(adj_nodes[i]);
                              var dirty2 = connect_nodes.indexOf(adj_nodes[i]);
                              if (dirty1 == -1 && dirty2 == -1){
                                 adjnode_check.push(adj_nodes[i]) ;
                                var position =  distribution_nodes.indexOf(adj_nodes[i]);
                                    distribution_nodes.splice(position,1); 
                                                 }
                              else{
                                 null;
                                  }
                                                             }   
                               if(adjnode_check.length>0){
                               //console.log(adjnode_check);
                               start_node = adjnode_check.pop();                              
                               connect_nodes.push(start_node);                                                              
                               adjacent_nodes(g,start_node,adjnode_check,connect_nodes,distribution_nodes,connect_table,function(){ connect_graph(1);},function(){Malicious_Reduce();});
                                                          }
                               else{  
                                      console.log(distribution_nodes.length);
                                      if( distribution_nodes.length==0){ connect_table.sort(function(a,b){return b.length-a.length});
                                                                         //console.log(connect_table);        
                                                                         if(typeof(callback)=='function'){                                                                                                                                                                                                    for(var i=0;i<connect_table.length;i++) {
                                                                             for(var j=0;j<connect_table[i].length;j++){
                                                                             node_table[connect_table[i][j]]['Subgraph']=i;
                                                                             for(s=0;s<edge_table.length;s++){
                                                                             if(edge_table[s]['_inV']== connect_table[i][j]||edge_table[s]['_outV']== connect_table[i][j]){
                                                                                edge_table[s]['Subgraph']=i;                                                                                                                                                                                                                                          }
                                                                                else{null;}
                                                                                                             }
                                                                                                                       }
                                                                                                                     }
                                                                                  callback();
                                                                                  callback2();
                                                                                                         }                                                                       
                                                                       }
                                      else{
                                      //console.log(connect_nodes);                                      
                                      connect_table.push(connect_nodes); 
                                      start_node = distribution_nodes.pop();
                                      connect_nodes =[]; 
                                      connect_nodes.push(start_node);
                                      adjnode_check =[];                                                                           
                                      adjacent_nodes(g,start_node,adjnode_check,connect_nodes,distribution_nodes,connect_table,function(){ connect_graph(1);},function(){Malicious_Reduce();}); 
                                          }
                                   } 
                                                                         });
}

//Conneted Subgraph
function connect_graph(subgraph){
document.getElementById('Stage2').innerHTML="";
 var rjson = {
               "graph": {
               "mode":"NORMAL",
               "vertices":node_table,
               "edges": edge_table }
                                      };

 var cont_g = new Helios.GraphDatabase();
     cont_g.loadGraphSON(rjson);
     cont_g.v({"Subgraph":{$eq:subgraph}}).then(function(result){
                var nodes=result;
                cont_g.e({"Subgraph":{$eq:subgraph}}).then(function(result){
                        var links=result;
                        links = d3link_converter(links);       
                        forcelayout(500,500,nodes,links,'Stage2');                                              
                        
});
});
}


function motif_graph(){
document.getElementById('Stage32').innerHTML="";
var MFjson= {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
var MF_g =  new Helios.GraphDatabase();

MF_g.loadGraphSON(MFjson);
//$hasNot:['motif_reduce']
MF_g.v().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
            var motif_node=result;
            var host_num=0;
            var url_num=0;
            var md5_num=0;
            var Motif1_num=0;
            var Motif2_num=0;
            var Motif3_num=0;
            var Motif4_num=0; 
            for(i=0;i<motif_node.length;i++){
                             if(motif_node[i]['group']==1){
                                 host_num++;
                                                      }
                             else if(motif_node[i]['group']==2){
                                 url_num++;
                                                           }
                             else if(motif_node[i]['group']==3){
                                 md5_num++;
                                                           }
                             else if(motif_node[i]['group']==4){
                                 Motif1_num++;
                                                           }
                             else if(motif_node[i]['group']==5){
                                 Motif2_num++;
                                                           }
                             else if(motif_node[i]['group']==6){
                                 Motif3_num++;
                                                           }
                             else if(motif_node[i]['group']==7){
                                 Motif4_num++;
                                                           }
                             if(i==motif_node.length-1){
                                 var content= "<p><font size='4' color='red'>Motif reduced graph</font></p>"+"Motif reduce graph  depend on below rules<br><br>"+"Total events:"+total_events+"   Hostname:" + host_num +"   Url:" + url_num +"   MD5:" + md5_num+"   Motif1:"+ Motif1_num+"   Motif2:"+ Motif2_num +"   Motif3:"+ Motif3_num +"   Motif4:" + Motif4_num ;
                                 document.getElementById('text32').innerHTML= content;
                                                   }
                                                        }
            MF_g.e().where({mal_reduce:{$eq:1},$hasNot:['motif_reduce']}).then(function(result){
            var motif_link=result;
            console.log(JSON.stringify(motif_link));
            motif_link = d3link_converter(motif_link);
            console.log(motif_node);
            console.log(motif_link);
            forcelayout(800,700,motif_node,motif_link,'Stage32');
});
});

setTimeout("Intention_reduce();",10000);

}
function Intention_graph(I_id,I_node){
//console.log(I_id);
//console.log(I_node);
var mjson= {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
var I_g =  new Helios.GraphDatabase();
I_g.loadGraphSON(mjson);
I_g.v(I_id).in().then(function(result){
for(i=0;i<result.length;i++){     
    node_table[result[i]['_id']]['Intention_reduce']=1;
    I_node.push(result[i]);
                            }
var content= "Total events:"+total_events+"   Hostname:" + result.length  ;
    document.getElementById('text42').innerHTML= content;
I_g.v(I_id).inE().then(function(result){
 var I_link=result;
     console.log(JSON.stringify(I_link));
     I_link = d3link_converter(I_link);
     forcelayout(800,600,I_node,I_link,'Stage4'); 
     call_map();
                                      });
                                      });
//call_map();
}
function Intention_reduce(){
var mjson= {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
var Intention_g =  new Helios.GraphDatabase();
var Intention_node=[];
// add Intention node
tem_node={"name":'Intention1',"group":8,"size":1000,"_type":"vertex","_id":eval(node_table.length)};
var Intention1_infor = add_node(tem_node,node_table,'Intention');
var Intention1_id = Intention1_infor[1];
Intention_node.push(tem_node);
tem_node={"name":'Intention2',"group":9,"size":1000,"_type":"vertex","_id":eval(node_table.length)};
var Intention2_infor = add_node(tem_node,node_table,'Intention');
var Intention2_id = Intention2_infor[1];
Intention_node.push(tem_node);
tem_node={"name":'Intention3',"group":10,"size":1000,"_type":"vertex","_id":eval(node_table.length)};
var Intention3_infor = add_node(tem_node,node_table,'Intention');
var Intention3_id = Intention3_infor[1];
Intention_node.push(tem_node);
tem_node={"name":'Intention4',"group":11,"size":1000,"_type":"vertex","_id":eval(node_table.length)};
var Intention4_infor = add_node(tem_node,node_table,'Intention');
var Intention4_id = Intention4_infor[1];
Intention_node.push(tem_node);
tem_node={"name":'Intention5',"group":12,"size":1000,"_type":"vertex","_id":eval(node_table.length)};
var Intention5_infor = add_node(tem_node,node_table,'Intention');
var Intention5_id = Intention5_infor[1];
Intention_node.push(tem_node);

Intention_g.loadGraphSON(mjson);
//Intention2
Intention_g.v({"group":{$eq:6}}).in().where({'group':{$eq:1}}).then(function(result){

 for(z=0;z<result.length;z++){
          var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_id'],"_inV":Intention2_id,"_type":'edge','Intention':1};
          add_edge(tem_new_edge,edge_table); 
                             }
//Intention3
Intention_g.v({"group":{$eq:4}}).in().where({'group':{$eq:1}}).then(function(result){

 for(z=0;z<result.length;z++){
           var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_id'],"_inV":Intention3_id,"_type":'edge','Intention':1};
           add_edge(tem_new_edge,edge_table);
                             }
//Intention4
Intention_g.v({"group":{$eq:5}}).in().where({'group':{$eq:1}}).then(function(result){

 for(z=0;z<result.length;z++){
          var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_id'],"_inV":Intention4_id,"_type":'edge','Intention':1};
          add_edge(tem_new_edge,edge_table);
                             }
//Intention5
Intention_g.v({"group":{$eq:7}}).in().where({'group':{$eq:1}}).then(function(result){

 for(z=0;z<result.length;z++){
          var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_id'],"_inV":Intention5_id,"_type":'edge','Intention':1};
          add_edge(tem_new_edge,edge_table); 
                             }
Intention_id=[];
Intention_id.push(Intention1_id);
Intention_id.push(Intention2_id);
Intention_id.push(Intention3_id);
Intention_id.push(Intention4_id);
Intention_id.push(Intention5_id);

Intention_graph(Intention_id,Intention_node);
});
});
});
});


}
function motif_reduce(){
var mjson= {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
var motif_g =  new Helios.GraphDatabase();
motif_g.loadGraphSON(mjson);      
motif_g.v({"group":{$eq:1}}).where({'mal_reduce':{$eq:1}}).id().then(function(result){
                    host = result;
                    //motif_g.v(result).out().both().where({group:{$eq:2}}).id().then(function(result){
                    //var motif3_set=result;
                        //host = result;
                    for(i=0;i<host.length;i++){
                    
                    //motif1
                    motif_g.v(host[i]).out().then(function(result){
                    var url = result;
                    if(url.length>1){
                    var url_id=[];
                    for(j=0;j<url.length;j++){
                          url_id.push(url[j]['_id']);
                                             }
                    for(j=0;j<url.length;j++){
                        motif_g.v(url[j]['_id']).out().path().then(function(result){
                              var url_path = result;
                              if(result.length==1 && result[0][1]['group']==3 && result[0][1]['degree']>1){
                                 var motif1_node=[];
                                 var motif1_name='';  
                                 motif_g.v(result[0][1]['_id']).in().then(function(result){                                       
                                       for(k=0;k<result.length;k++){
                                           if( url_id.indexOf(result[k]['_id']) != -1){
                                               //console.log(result[k]['_id']);
                                               motif1_node.push(result[k]);      
                                               motif1_name += JSON.stringify(result[k]);                                                                                                
                                                                                      }
                                                                   } 
                                       if(motif1_node.length>1){
                                                //add motif1 node
                                                tem_node={"name":motif1_name,"group":4,"size":300,"_type":"vertex","_id":eval(node_table.length),"mal_reduce":1};
                                                var motif1_infor = add_node(tem_node,node_table,'motif1');
                                                var motif1_id = motif1_infor[1];
                                                //reduce node
                                                for(s=0;s<motif1_node.length;s++){
                                                     node_table[motif1_node[s]['_id']]['motif_reduce'] =1;   
                                                     var reduce_url_id= motif1_node[s]['_id'];
                                                     //reduce edge
                                                     motif_g.v(reduce_url_id).outE().then(function(result){
                                                     for(z=0;z<result.length;z++){
                                                          edge_table[result[z]['_id']]['motif_reduce']=1;
                                                          var tem_new_edge = {"_id":eval(edge_table.length),"_outV":motif1_id,"_inV":result[z]['_in'],"_type":'edge','mal_reduce':1};
                                                          add_edge(tem_new_edge,edge_table);
                                                                                 } 
                                                                                                          });
                                                                                 }
                                                for(a=0;a<motif1_node.length;a++){      
                                                     motif_g.v(motif1_node[a]['_id']).inE().then(function(result){
                                                     for(z=0;z<result.length;z++){
                                                          edge_table[result[z]['_id']]['motif_reduce']=1;
                                                          var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_out'],"_inV":motif1_id,"_type":'edge','mal_reduce':1};
                                                          add_edge(tem_new_edge,edge_table);
                                                                                 }     
                                                                                 console.log("m1");
                                                                                 motif1_dirty=1;                  
                                                                                                                  });   
                                                                                 }
                                                              }                                     
                                                                                           });
                                        
                                                                                                          }
                                                                                   });
                                               }                            
                                                                      
                                    }
                                                                   });      
                      //motif2
                    motif_g.v(host[i]).out().where({'degree':{$eq:2}}).id().then(function(result){
                    motif_g.v(result).out().where({'group':{$eq:3},degree:{$eq:1}}).path().then(function(result){
                    var motif2_node=[];
                    var motif2_node_id=[];
                    var motif2_name='';
                    if(result.length!=0){
                    for(j=0;j<result.length;j++){
                    if(j==0 && result.length>1){
                       if(result[j][0]['_id']!=result[j+1][0]['_id']){
                          motif2_node.push(result[j][0]);
                          motif2_node.push(result[j][1]);
                          motif2_node_id.push(result[j][0]['_id']);
                          motif2_node_id.push(result[j][1]['_id']); 
                          motif2_name +=  JSON.stringify(result[j][0]);                                                                                          motif2_name +=  JSON.stringify(result[j][1]);
                                                                     }
                    }
                    else if(j==result.length-1 && result.length>2){
                       if(result[j][0]['_id']!=result[j-1][0]['_id']){
                          motif2_node.push(result[j][0]);
                          motif2_node.push(result[j][1]);
                          motif2_node_id.push(result[j][0]['_id']);
                          motif2_node_id.push(result[j][1]['_id']);
                          motif2_name +=  JSON.stringify(result[j][0]);                                                                                          motif2_name +=  JSON.stringify(result[j][1]);
                                                                     }    
                                               } 
                    else if(result.length>2){
                       if(result[j][0]['_id']!=result[j+1][0]['_id'] && result[j][0]['_id']!=result[j-1][0]['_id']  ){
                          motif2_node.push(result[j][0]);
                          motif2_node.push(result[j][1]);
                          motif2_node_id.push(result[j][0]['_id']);
                          motif2_node_id.push(result[j][1]['_id']);
                          motif2_name +=  JSON.stringify(result[j][0]);
                          motif2_name +=  JSON.stringify(result[j][1]);
                         }
                                                }  
                                         }
                                            } 
                    if(motif2_node.length>1){
                    //add node 
                    tem_node={"name":motif2_name,"group":5,"size":300,"_type":"vertex","_id":eval(node_table.length),"mal_reduce":1};
                              var motif2_infor = add_node(tem_node,node_table,'motif2');
                              var motif2_id = motif2_infor[1];
                    //reduce node
                             for(s=0;s<motif2_node.length;s++){
                                     node_table[motif2_node[s]['_id']]['motif_reduce'] =1;
                                     var reduce_url_id= motif2_node[s]['_id'];
                                                              }
                                     //reduce edge
                                     motif_g.v(motif2_node_id).outE().then(function(result){
                                     for(z=0;z<result.length;z++){
                                         edge_table[result[z]['_id']]['motif_reduce']=1;
                                          if(motif2_node_id.indexOf(result[z]['_in']) ==-1 ){
                                             var tem_new_edge = {"_id":eval(edge_table.length),"_outV":motif2_id,"_inV":result[z]['_in'],"_type":'edge','mal_reduce':1};
                                             add_edge(tem_new_edge,edge_table);
                                                                                            }   
                                                                }    
                                     motif_g.v(motif2_node_id).inE().then(function(result){
                                            for(z=0;z<result.length;z++){
                                               edge_table[result[z]['_id']]['motif_reduce']=1;
                                            if(motif2_node_id.indexOf(result[z]['_out']) ==-1 ){
                                               var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_out'],"_inV":motif2_id,"_type":'edge','mal_reduce':1};
                                               add_edge(tem_new_edge,edge_table);
                                                                                               }
                                                                        }
                                                 motif2_dirty=1;
                                                 console.log("m2");
                                                                            });
                                                                             });
                  
                                            }                         
                                                                   });

                                                                  });  
                        //motif3
                        
                        motif_g.v(host[i]).out().id().then(function(result){
                        m3_url = result;
                        motif_g.v(m3_url).both().where({group:{$eq:2}}).then(function(result){
                        var motif3_node=[];
                        var motif3_name='';
                        var motif3_node_id=[];
                        for(j=0;j<result.length;j++){       
                        if(m3_url.indexOf(result[j]['_id'])!=-1){
                            motif3_node_id.push(result[j]['_id']);
                            motif3_node.push(result[j]);
                            motif3_name += JSON.stringify(result[j]);
                                                             }
                                                   }
                         //add motif3 node
                         if(motif3_node.length>1){
                         tem_node={"name":motif3_name,"group":6,"size":300,"_type":"vertex","_id":eval(node_table.length),"mal_reduce":1};
                             var motif3_infor = add_node(tem_node,node_table,'motif3');
                             var motif3_id = motif3_infor[1];     
                      
                         //reduce node                         
                            for(z=0;z<motif3_node.length;z++){
                            node_table[motif3_node[z]['_id']]['motif_reduce'] =1;
                                                             }
                         //add edge and reduce edge
                            motif_g.v(motif3_node_id).outE().then(function(result){
                            for(z=0;z<result.length;z++){
                                         edge_table[result[z]['_id']]['motif_reduce']=1;
                                          if(motif3_node_id.indexOf(result[z]['_in']) ==-1 ){ 
                                             var tem_new_edge = {"_id":eval(edge_table.length),"_outV":motif3_id,"_inV":result[z]['_in'],"_type":'edge','mal_reduce':1};
                                             add_edge(tem_new_edge,edge_table);
                                                                                      }
                                                        }
                            motif_g.v(motif3_node_id).inE().then(function(result){
                                            for(z=0;z<result.length;z++){
                                               edge_table[result[z]['_id']]['motif_reduce']=1;
                                            if(motif3_node_id.indexOf(result[z]['_out']) ==-1 ){ 
                                               var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_out'],"_inV":motif3_id,"_type":'edge','mal_reduce':1};
                                               add_edge(tem_new_edge,edge_table);  
                                                                                         }
                                                                        }   
                                                 motif3_dirty=1
                                                 console.log("m3"); 
                                                                            });
                                                                             });    
                                                }                      
                                                                       });
                                                                     });
                        //motif4
                          motif_g.v(host[i]).out().then(function(result){
                    url = result;
                    for(j=0;j<url.length;j++){
                        motif_g.v(url[j]['_id']).out().path().then(function(result){
                          if(result.length >1 ){
                             var motif4_node=[]; 
                             var motif4_node_id=[]
                             var motif4_name= JSON.stringify(result[0][0]);
                             //add urla
                             motif4_node.push(result[0][0]); 
                             motif4_node_id.push(result[0][0]['_id']); 
                         for(k=0;k<result.length;k++){
                             if(result[k][1]['group']==3 && result[k][1]['degree']==1){
                                 motif4_node.push(result[k][1]);
                                 motif4_node_id.push(result[k][1]['_id']);
                                 motif4_name += JSON.stringify(result[k][1]);
                                                         }
                                                     }
                         if(motif4_node.length>2) {
      
                             tem_node={"name":motif4_name,"group":7,"size":300,"_type":"vertex","_id":eval(node_table.length),"mal_reduce":1};
                             var motif4_infor = add_node(tem_node,node_table,'motif4');
                             var motif4_id = motif4_infor[1];
                             //reduce mode
                             var  motif_url = motif4_node[0]['_id'];
                             node_table[motif4_node[0]['_id']]['motif_reduce'] =1;
                             for(k=1;k<motif4_node.length;k++){
                                 node_table[motif4_node[k]['_id']]['motif_reduce'] =1;
                             //reduce edge   
                              var motif_md5 = motif4_node[k]['_id']; 
                              motif_g.v([motif_url,motif_md5]).outE().then(function(result){
                                     for(z=0;z<result.length;z++){
                                         edge_table[result[z]['_id']]['motif_reduce']=1;
                                         if(motif4_node_id.indexOf(result[z]['_in']) == -1 ){
                                         var tem_new_edge = {"_id":eval(edge_table.length),"_outV":motif4_id,"_inV":result[z]['_in'],"_type":'edge','mal_reduce':1};
                                         add_edge(tem_new_edge,edge_table); 
                                                                          }
                                                                 }
                                        motif_g.v([motif_url,motif_md5]).inE().then(function(result){
                                            for(z=0;z<result.length;z++){
                                               edge_table[result[z]['_id']]['motif_reduce']=1;
                                               if(motif4_node_id.indexOf(result[z]['_out']) == -1){
                                               var tem_new_edge = {"_id":eval(edge_table.length),"_outV":result[z]['_out'],"_inV":motif4_id,"_type":'edge','mal_reduce':1};
                                               add_edge(tem_new_edge,edge_table); 
                                                                                                  }
                                                                        }
                                                motif4_dirty=1
                                                console.log("m4");
                                                                                                    });
                                                                                            });
                                                         }
                                                  }                             
                                                                          }                                                      
                                                                                   });
                                             }
                                                                  });  
                                                }  

                                               //});  
                                               console.log("start");
                                               setTimeout("motif_graph();",60000);
                                                                                        });
}

function Malicious_Reduce(callback){
document.getElementById('Stage31').innerHTML="";
      var rjson = {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
      var mal_g =  new Helios.GraphDatabase();
      mal_g.loadGraphSON(rjson);  //{"group":{$eq:3}} //{"exploitlist":{$eq:1}},
      mal_g.v({"exploitlist":{$eq:1}},{"group":{$eq:3}}).property('Subgraph').then(function(result){
                         var requement =[];
                         var requement_id=[];
                         for(i=0;i<result.length;i++){
                             var dirty_bit =requement_id.indexOf(result[i]);
                             if(dirty_bit==-1){ requement_id.push(result[i]);
                                                requement.push({Subgraph:{$eq:result[i]}});
                                              }
                                                     }
                         
                         var links=[];
                         //console.log(requement);
                         mal_g.v().where(requement).then(function(result){
                                   var motif_nodes= result;
                                   var nodes=result;
                                   for(i=0;i<nodes.length;i++){
                                            node_table[nodes[i]['_id']]['mal_reduce']=1; 
                                                              }
                                   mal_g.e().where(requement).then(function(result){
                                   var motif_links =result;
                                   var links=result;
                                   for(i=0;i<links.length;i++){
                                            edge_table[links[i]['_id']]['mal_reduce']=1;
                                                              }
                                   connect_graph(0);                                   
                                   links = d3link_converter(links);
                                   var host_num=0;
                                   var url_num=0;
                                   var md5_num=0;
                                   for(i=0;i<nodes.length;i++){
                                       //document.getElementById('HPGraphs1').innerHTML="Hostname:" + result;
                                       if(nodes[i]['group']==1){
                                             host_num++;
                                                               }
                                   else if(nodes[i]['group']==2){
                                             url_num++;
                                                                }
                                   else if(nodes[i]['group']==3){
                                             md5_num++;
                                                                }
                                   if(i==nodes.length-1){
                                      var content= "<p><font size='4' color='red'>Malicious reduced graph</font></p><br>"+"Malicious reduced graph is aimed to simply the original graph by deleting inessential paths which doesn't include exploit url nodes or downloaded files nodes (md5 nodes)"+"<br> Total THUG events ("+total_events+") are used to generate the graph. The reduced graph included ("+host_num+") hostname nodes, ("+url_num+") urls and ("+md5_num+") downloaded md5 files.<br>"+"Hostname node is colored in <b><font color='#19FF1C'>green</font></b>, url nodes in <b><font color='#FFB6C1'>pink</font></b> and downloaded md5 nodes in <b><font color='#0000FF'>blue</font></b>.";
                                 document.getElementById('text31').innerHTML= content;
                                                         }
                                                               }                                   
                                   forcelayout(800,600,nodes,links,'Stage31');//menuitems    HPGraphs2 1200 700
                                   motif_reduce();

                                  }); 
                         });
 
});
//call_map();
}

function call_map(){
document.getElementById('listdiv').innerHTML="";
document.getElementById('mapdiv').innerHTML="";
console.log("map");
var rjson = {
                    "graph": {
                    "mode":"NORMAL",
                    "vertices":node_table,
                    "edges": edge_table }
                                        };
var map_g =  new Helios.GraphDatabase();
    map_g.loadGraphSON(rjson);
    map_g.v({"group":{$eq:1}}).where({'Intention_reduce':{$eq:1}}).map('name','_id','geolon','geolat','geocity').then(function(result){
        for(i=0;i<result.length;i++){
            var tem_um_num=0;
            for(j=0;j<edge_table.length;j++){
                if(edge_table[j]["_outV"]== result[i]["_id"]){
                         M_group = node_table[edge_table[j]["_inV"]]['group']; 
                       if(M_group==4|M_group==5|M_group==6|M_group==7){
                                      var tem_json = node_table[edge_table[j]["_inV"]]['name'].replace(/}/g,"}},");
                                          tem_json = tem_json.substring(0,tem_json.length-2);                                  
                                          tem_json = tem_json.split("},");
                                          tem_um_num += tem_json.length;
                                                                      } 
                                                             }
                                            }                   
            console.log(tem_um_num);
            if(tem_um_num>20){
               result[i]['threaten']="Serious";               
                             } 
            else if(tem_um_num <=5){
               result[i]['threaten']="light";
                                   }
            else{
               result[i]['threaten']="medium";
                }
                                    }
          //console.log(result);
    var json=[];
    for(i=0;i<result.length;i++){
        if(typeof(result[i]['geocity']) == "object" ){
                    var tem_city = "Unknown"  ;
                                                     }
        else if(result[i]['geocity'] == "None"){
                    var tem_city = "Unknown"  ; 
                                               }
        else{ 
              tem_city= result[i]['geocity']; 
            }
        if(result[i]['threaten']=="Serious"){
           var tem_color = "#880000";
                                            }
        else if(result[i]['threaten']=="light"){
            var tem_color = "#88AA00";
                                               }
        else{
            var tem_color = "#0000AA";
            }
        tem ={                  
              title: result[i]['name']+"."+"City:"+tem_city,
              latitude: result[i]['geolat'],
              longitude: result[i]['geolon'], 
              color:tem_color
             };
        json.push(tem);     
                                }     
        console.log("map2");
        World_Map(json);                          
});
/*
var jsonss=[ {title: "Bfasls",
            latitude: 48.2092,
           longitude: 4.3676}];
*/
//World_Map(jsonss);
}



function origraph(){
//document.getElementById('Stage1').innerHTML="";
document.getElementById('Stage1').style.display = 'block';
document.getElementById('text12').style.display = 'block';
}


function HPGraphs(json){
var g = new Helios.GraphDatabase();
g.loadGraphSON(json);
//Original graph
g.v().then(function(result){ 
                             var nodes=result;  //forcelayout(gnodes,glinks);
                             var host_num=0;
                             var url_num=0;
                             var md5_num=0;
                             for(i=0;i<result.length;i++){
                             //document.getElementById('HPGraphs1').innerHTML="Hostname:" + result;
                             if(result[i]['group']==1){
                                 host_num++;
                                                      }
                             else if(result[i]['group']==2){
                                 url_num++;
                                                           }
                             else if(result[i]['group']==3){
                                 md5_num++;
                                                           }

                             if(i==result.length-1){
                                 var content= "Total events:"+total_events+'<br>'+"Hostname:" + host_num +'<br>'+"Url:" + url_num +'<br>'+"MD5:" + md5_num +'<br><a onclick="origraph('+')"  >Original Graph</a>';
                                 document.getElementById('text11').innerHTML= content;
                                                   }
                                                        }
                             g.e().then(function(result){   
                             //document.getElementById('HPGraphs1').innerHTML="Schools";    
                             var links=result;
                             links = d3link_converter(links);
                             document.getElementById('Stage1').style.display = 'none';
                             forcelayout(1200,700,nodes,links,'Stage1');                             
});
                             
}); 

//Cut Original graph and add 'sugraph' attribute
var connect_nodes=[];
var adjnode_check=[];
var connect_table=[]
connect_nodes.push(0);
//connect_graph(connect_nodes,adjnode_check);
var distribution_nodes=[];
for(q=0;q<node_table.length;q++){
   distribution_nodes[q]=q;
                                }

var callback = function(){adjacent_nodes(g,0,adjnode_check,connect_nodes,distribution_nodes,connect_table,function(){connect_graph(0);},function(){Malicious_Reduce();});};
if(typeof(callback)=='function' && distribution_nodes.length >0){
       //console.log(distribution_nodes.length);
       callback();


}
//adjacent_nodes(g,0,adjnode_check,connect_nodes,distribution_nodes,connect_table,function(){connect_graph(1);},function(){Malicious_Reduce();});
}

function MalGraphs(json){
var g = new Helios.GraphDatabase();
g.loadGraphSON(json);
//Original graph
g.v().then(function(result){
                             var nodes=result;  //forcelayout(gnodes,glinks);
                             g.e().then(function(result){
                             var links=result;
                             links = d3link_converter(links);
                             mal_forcelayout(1200,700,nodes,links,'malgraph');
});

});
}


