function d3node_converter(node){
         for(var i=0;i<node.length;i++){
            node[i]['id']=node[i]._id;
            delete node[i]._id ;
            delete node[i]._type;  
}
         return node;
}

function d3link_converter(link){
        for(var i=0;i<link.length;i++){
           link[i]['source']= link[i]._out;
           link[i]['target']= link[i]._in;
           link[i]['type'] = 'suit';
           delete link[i]._in ;
           delete link[i]._out ; 
           delete link[i]._id ;         
}
       
       return link ;           
}

function add_node(new_node,table,source){
         var new_id = new_node['_id'];
         if(new_node['name'][new_node['name'].length-1]=='/'){
            new_node['name'] = new_node['name'].slice(0,new_node['name'].length-1);
         }
         var name=new_node['name'];                  
         var dirty_bit = 0 ;
         // css node or js noed?
         if(source=="motif2" || source =="exploitlist"){
               var check_css = -1;
               var check_js = -1;
         }
         else{
         var check_css = name.search(".css");
         var check_js = name.search(".js");
         }
         if(check_css==-1 && check_js==-1){
         //repeat node?         
         for(var i=0;i<table.length;i++){
           if (table[i]['name'] == name ){
               dirty_bit = dirty_bit +1;
               new_id= table[i]['_id'];
               if(new_node['group']==1 && source == 'hostlist'){table[i]['group']=1; 
                                        table[i]["geolon"]=new_node["geolon"];
                                        table[i]["geolat"]=new_node["geolat"];
                                        table[i]["geocity"]=new_node["geocity"]; 
                                          
                                       }
               else if(new_node['group']==2 && source == 'exploitlist'){
                                             table[i]['classification']=new_node['classification'];
                                             table[i]["rule"]=new_node["rule"];
                                             table[i]["exploitlist"]=1;  
                                             table[i]["stroke"]=1;                                    
                                                                       }                               
               else{ null ;}
                                        }          
           else{
               null;
               }
}        
         if (dirty_bit ==0 && new_node['name']!=null){
              table.push(new_node);               
                                                     }  
         else{
              null;
             }
        var infor=[table,new_id];
        return infor; }
        else{
        // css or js  , not add to table 
        new_id = -1;
        var infor=[table,new_id];
        return infor;
        } 
}
function add_edge(new_edge,table){
         //var new_edge = {"_id":new_id,"_outV":f_id,"_inV":t_id,"_type":'edge'};
         f_id = new_edge['_outV'];
         t_id = new_edge['_inV'];         
         var dirty_bit = 0 ;
         //repeat edge?  
         for(var i=0;i<table.length;i++){
         if (table[i]['_outV'] == f_id && table[i]['_inV'] == t_id){
               dirty_bit = dirty_bit +1;               
               }
           else{
               null;
               }
}
         if (dirty_bit ==0 && f_id != -1 && t_id!=-1){
            table.push(new_edge);
            node_table[t_id]['degree'] = node_table[t_id]['degree'] +1;
            node_table[f_id]['degree'] = node_table[f_id]['degree'] +1;
           }
         else{
             null;
          }
        return table;
        
}
function json_converter(json,ntable,etable){
  //console.log(json);
  for(var s=0;s<json.length;s++){
  
 //extract from hostlist
        var hostlist = json[s]['_source']['hostnameList'];
           if(typeof(hostlist)=="undefined"){
              null;
           }
           else if(hostlist.length==0){
              null;
           }
           else{
           hostlist = hostlist.replace(/, /g,"");
           hostlist = hostlist.replace(/]}/g,"]}***");             
           //hostlist = hostlist.replace(/}/g,"}***");
           hostlist = hostlist.split("***");           
           for (var i=0;i<hostlist.length-1;i++){
               var hostjson = JSON.parse(hostlist[i]);
               //add host name
               var tem_new_node = {"name":'http://'+hostjson['hostname'],"group":1,"_id":eval(ntable.length),"_type":"vertex",'size':300,"geocity":hostjson["geoinfo"]["geocity"],"geolat":hostjson["geoinfo"]["geolat"],"geolon":hostjson["geoinfo"]["geolon"],"geocode":hostjson["geoinfo"]["geocode"],'degree':0};
               var hostnode_infor = add_node(tem_new_node,ntable,'hostlist');
               ntable = hostnode_infor[0] ;
               var hostnode_id = hostnode_infor[1];
               //add path
               for(z=0;z<hostjson['underpath'].length;z++){
               if(hostjson["underpath"][z]==''){
                        null;
               }
               else{
               var hostpath = 'http://'+hostjson["hostname"]+hostjson["underpath"][z];
               //console.log(hostpath);
               var tem_new_node = {"name":hostpath,"group":2,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
               var hostpath_infor = add_node(tem_new_node,ntable,'hostlist');
               ntable = hostpath_infor[0] ;
               var hostpath_id = hostpath_infor[1];
               }
               //add edge
               if( hostpath_id !=-1 && hostpath_id !=null && hostpath_id != hostnode_id){
               var tem_new_edge = {"_id":eval(etable.length),"_outV":hostnode_id,"_inV":hostpath_id,"_type":'edge','ori':1};
               etable = add_edge(tem_new_edge,etable);
               }
               else{ null; }
               }
                                  }
               }

     //extract from urlList
        var urllist = json[s]['_source']['urlList'];
        if(typeof(urllist)=="undefined"){
           null;
        }
        else if(urllist.length==0){
               null
        }
        else{        
        urllist =  urllist.replace(/, /g,"");
        urllist = urllist.replace(/"}/g,"\"}***");
        //urllist = urllist.replace(/"]}/g,"\"]}***");
        urllist = urllist.split("***");
        for (var i=0;i<urllist.length-1;i++){
             var urljson = JSON.parse(urllist[i]);
         //from node
        var tem_new_node = {"name":urljson['urlfrom'],"group":2,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
        var fnode_infor  = add_node(tem_new_node,ntable,'urllist');
        ntable = fnode_infor[0] ;
        var fnode_id = fnode_infor[1];
        // to node
        var tem_new_node = {"name":urljson['urlto'],"group":2,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
        var tnode_infor  = add_node(tem_new_node,ntable,'urllist');
        ntable = tnode_infor[0] ;
        var tnode_id = tnode_infor[1];
        // add edge      //&& fnode_id != tnode_id
        if(fnode_id !=-1 && tnode_id != -1  && fnode_id != tnode_id ){
        var tem_new_edge = {"_id":eval(etable.length),"_outV":fnode_id,"_inV":tnode_id,"_type":'edge','ori':1};
        etable = add_edge(tem_new_edge,etable);
                                                                     }
        else{ null ;}

             

        }  
        }
        //extract from md5List
        var md5list = json[s]['_source']['md5List'];
        if(typeof(md5list)=="undefined"){
           null;
        }
        else if(md5list.length==0){
           null; 
        }
        else{
        md5list =  md5list.replace(/, /g,"");
        md5list = md5list.replace(/"}{/g,"\"}***{");
        md5list = md5list.split("***");
        for (var i=0;i<md5list.length;i++){
             //console.log(md5list[i]);
             var md5json = JSON.parse(md5list[i]);
             //mal host
             var tem_new_node = {"name":'http://'+md5json['malhostname'],"group":1,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
             var mal_hnode_infor = add_node(tem_new_node,ntable,'md5list');
             ntable = mal_hnode_infor[0] ;
             var mal_hnode_id = mal_hnode_infor[1];
             //mal url  
             var tem_new_node = {"name":md5json['malurl'],"group":2,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
             var mal_unode_infor = add_node(tem_new_node,ntable,'md5list');
             ntable = mal_unode_infor[0] ;         
             var mal_unode_id = mal_unode_infor[1]; 
             // md5 value
             var tem_new_node = {"name":md5json['md5'],"md5_type":md5json['type'],"group":3,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
             var mnode_infor = add_node(tem_new_node,ntable,'md5list');
             ntable = mnode_infor[0] ;
             var mnode_id = mnode_infor[1];
             // add edge host and url
             if(mal_hnode_id !=-1 && mal_unode_id !=-1 && mal_hnode_id != mal_unode_id){
             var tem_new_edge = {"_id":eval(etable.length),"_outV":mal_hnode_id,"_inV":mal_unode_id,"_type":'edge','ori':1};
             etable = add_edge(tem_new_edge,etable);
                                                                                       }
             else{ null;}
             if(mnode_id !=-1 && mal_unode_id !=-1 && mnode_id != mal_unode_id){
             var tem_new_edge = {"_id":eval(etable.length),"_outV":mal_unode_id,"_inV":mnode_id,"_type":'edge','ori':1};
             etable = add_edge(tem_new_edge,etable);
                                                                               }
             else{ null;}
                                }
             }
        //extract from exploitList
        var exploitlist = json[s]['_source']['exploitList'];
        if(typeof(exploitlist)=="undefined"){
           null;
        }
        else if(exploitlist.length==0){
           null;
        }
        else{        
        exploitlist = exploitlist.replace(/, /g,"");
        exploitlist = exploitlist.replace(/"}/g,"\"}***");
        exploitlist = exploitlist.split("***");
        //console.log(exploitlist.length);
    
        for (var i=0;i<exploitlist.length-1;i++){
             //console.log(exploitlist[i]);
             var tem_json = JSON.parse(exploitlist[i]);
             // urlc node
             var tem_new_node = {"name":tem_json['urlc'],"group":2,"_id":eval(ntable.length),"_type":"vertex","classification":tem_json['classification'],"rule":tem_json['rule'],'size':300,'degree':0,"exploitlist":1,"stroke":1};
             var urlcnode_infor = add_node(tem_new_node,ntable,'exploitlist');
             ntable = urlcnode_infor[0] ;
             var urlcnode_id = urlcnode_infor[1];
             //console.log(urlcnode_id);
             
                                }
             } 

     
}
//build graph      
var rjson = {
  "graph": {
          "mode":"NORMAL",
          "vertices":ntable
,
          "edges": etable
           
           }
};
HPGraphs(rjson);

}
function mal_json_converter(json,ntable,etable){
  for(var s=0;s<json.length;s++){
 //extract from vmethod.malhost.hostname
        var mal_host = json[s]['_source']['vmethod.malhost.hostname'];
           if(typeof(mal_host)=="undefined"){
              null;
           }
           else if(mal_host.length==0){
              null;
           }
           else{
               var tem_new_node = {"name":mal_host,"group":1,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
               var hostnode_infor = add_node(tem_new_node,ntable,'mal_host');
               ntable = hostnode_infor[0] ;
               var hostnode_id = hostnode_infor[1];
               }
        // /extract from  vmethod.malhost.geocode
        var mal_geocode = json[s]['_source']['vmethod.malhost.geocode'];
           if(typeof(mal_geocode)=="undefined"){
              null;
           }
           else if(mal_geocode.length==0){
              null;
           }
           else{
               var tem_new_node = {"name":mal_geocode,"group":2,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
               var mal_geocode_infor = add_node(tem_new_node,ntable,'mal_geocode');
               ntable = mal_geocode_infor[0] ;
               var mal_geocode_id = mal_geocode_infor[1];
               } 
        // /extract from  md5
        var mal_md5 = json[s]['_source']['md5'];
           if(typeof(mal_md5)=="undefined"){
              null;
           }
           else if(mal_md5.length==0){
              null;
           }
           else{
               var tem_new_node = {"name":mal_md5,"group":3,"_id":eval(ntable.length),"_type":"vertex",'size':300,'degree':0};
               var mal_md5_infor = add_node(tem_new_node,ntable,'mal_md5');
               ntable = mal_md5_infor[0] ;
               var mal_md5_id = mal_md5_infor[1];
               }
           var tem_new_edge = {"_id":eval(etable.length),"_outV":mal_geocode_id,"_inV":hostnode_id,"_type":'edge'};
               etable = add_edge(tem_new_edge,etable);
           var tem_new_edge = {"_id":eval(etable.length),"_outV":hostnode_id,"_inV":mal_md5_id,"_type":'edge'};
               etable = add_edge(tem_new_edge,etable);
}

var rjson = {
  "graph": {
          "mode":"NORMAL",
          "vertices":ntable
,
          "edges": etable

           }
};

MalGraphs(rjson);
}
var node_table =[];
var edge_table =[]; 
//var gnodes2 =[];
//var glinks2 = [] ;
//var gnodes3 ;
//var glinks3 =[];
var connet_buffer=[];

