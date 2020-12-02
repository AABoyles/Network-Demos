
function toGraph(nodes, links){
  links = JSON.parse(JSON.stringify(links));
  let n = nodes.length;
  for(let i = links.length; i >= 0; --i){
    let l = links[i];
    for(let j = 0; j < n; j++){
      let d = nodes[j];
      if(l.source == d.id) l.source = d;
      if(l.target == d.id) l.target = d;
    }
  }
  return(links)
}

function toLinkList(graph){
  
}