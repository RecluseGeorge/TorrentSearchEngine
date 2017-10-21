window.onload = function(){
	document.getElementById("query").addEventListener("keypress",search,false);
}

var site = "https://tpbship.org/";

function search(e){
	if(e.keyCode == 13){
		document.getElementById("res").innerHTML = '<div class="col-lg-12" align="center"><img src="./load.gif" style="width:260px;height:260px;;align="center"/><div>';
		var a = [];var b = [];var c = [];var d = [];var e = []
		var query = document.getElementById("query").value;
		if(query != ""){
			var trlink = site+"search/"+query;
			var nobj = new XMLHttpRequest();
			nobj.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					var soup = this.responseXML;
					var links = soup.getElementsByTagName("a")
					if(links.length == 0){
						format(0,0,0,0,0,"empty",0);
					}
					var count = 0
					for(var i=0;i<=links.length-1;i++){
						if(links[i].href.indexOf("/torrent/") >= 0){count++;}
					}
					var len = count;
					for(var i=0;i<=links.length-1;i++){
						if(links[i].href.indexOf("/torrent/") >= 0){
							a.push(links[i].innerHTML)
							b.push(links[i].href)
							var nnobj =  new XMLHttpRequest();
							nnobj.onreadystatechange = function(){
								if(this.readyState == 4 && this.status == 200){
									var soup = this.responseXML;
									var mlinks = soup.getElementsByTagName("a") 
									for(var j=0;j<=mlinks.length-1;j++){
										if(mlinks[j].href.indexOf("magnet:") >= 0){
											c.push(mlinks[j].href)
											break;
										}
									}
									try{
										var dets = soup.getElementsByClassName("col1")[0].childNodes;
									}
									catch(e){
										document.getElementById("res").innerHTML = "NEIN";
									}
									var key = [];var value = []
									for(var k = 0;k<=dets.length-1;k++){
										if(dets[k].tagName == "DT"){
											key.push(dets[k].textContent);
										}
										else if(dets[k].tagName == "DD"){
											value.push(dets[k].textContent);
										}
									}
									var dets = soup.getElementsByClassName("col2")[0].childNodes;
									for(var k = 0;k<=dets.length-1;k++){
										if(dets[k].tagName == "DT"){
											key.push(dets[k].textContent);
										}
										else if(dets[k].tagName == "DD"){
											value.push(dets[k].textContent);
										}
									}
									d.push(key)
									e.push(value)
									format(a,b,c,d,e,"",len)
								}
							}
							nnobj.open("GET",links[i].href,true);
							nnobj.responseType = 'document';
							nnobj.send();
						}
					}
				}
			}
			nobj.open("GET",trlink,true);
			nobj.responseType = 'document';
			nobj.send();
		}
		else{
			document.getElementById("res").innerHTML = '';
		}
	}
}

function format(a,b,c,d,e,msg,l){
	if(msg == "empty"){
		document.getElementById("res").innerHTML = '<div class="col-lg-12" align="center"><p>No Results</p></div>';
	}
	else{
		if(a.length == l && b.length == l && c.length == l && d.length == l && e.length == l){
			document.getElementById("res").innerHTML = "";
			for(var i = 0;i<=a.length-1;i++){
				var type = "";
				var seeders = "";
				var leechers = "";
				var size = "";
				var name = a[i];
				var magnet = c[i];
				for(var j = 0;j<=d[i].length-1;j++){
					if(d[i][j] == "Type:"){
						type = e[i][j];
					}
					if(d[i][j] == "Seeders:"){
						seeders = e[i][j];
					}
					if(d[i][j] == "Leechers:"){
						leechers = e[i][j];
					}	
					if(d[i][j] == "Size:"){
						size = e[i][j];
					}
				}
				document.getElementById("res").innerHTML += '<div id="'+magnet+'" class="twPc-div magnet-panel" align="center" style="word-wrap:break-word;"><div><div class="twPc-divUser"><div class="twPc-divName"><a href="'+magnet+'">'+name+'</a></div></div><br /><div class="twPc-divStats"><ul class="twPc-Arrange"><li class="col-lg-4"><a><span class="twPc-StatLabel twPc-block">Size</span></span><span class="twPc-StatValue">'+size+'</span></a></li><li class="col-lg-4"><a><span class="twPc-StatLabel twPc-block">Seeders</span><span class="twPc-StatValue">'+seeders+'</span></a></li><li class="col-lg-4"><a><span class="twPc-StatLabel twPc-block">Leechers</span><span class="twPc-StatValue">'+leechers+'</span></a></li></ul></div></div></div>';
			}
			var panels = document.getElementsByClassName("magnet-panel");
			for(var i = 0;i<=panels.length-1;i++){
				panels[i].addEventListener("click",function(){window.location.href = this.id;},"false");
			}
		}	
	}
}