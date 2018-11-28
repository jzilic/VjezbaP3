///////////////
/// READ
///////////////

function ucitaj(){
	$.getJSON(putanjaAPI + "/automobil", function( jsonData ) {
		postaviNaTablicu(jsonData);
	});
}

ucitaj();


///////////////
/// CREATE
///////////////
$("#noviOperater").click(function(){
	jQuery.each($("#forma").serializeArray(), function() {
		$("#" + this.name).val("");
    });
    $("#sifra").val("0");
	$('#modal').modal('show');  		
	return false;
});


///////////////
/// UPDATE
///////////////

$("#spremi").click(function(){
    var json = {};
    jQuery.each($("#forma").serializeArray(), function() {
        json[this.name] = this.value || '';
    });
	if(json["sifra"]=="0"){
		delete json.sifra;
		ajax(putanjaAPI + "/noviAutomobil",json);
	}else{
		ajax(putanjaAPI + "/update",json);
	}
	return false;
});


///////////////
/// SEARCH
///////////////

$("#traziForma").submit(function( event ) {
	trazi();
	return false;
});


$("#uvjet").keyup(function( event ) {
	trazi();
	return false;
});



//Ova funkcija je potrebna kako bi nakon ajax-a mogli na novo učitane redove definirati događaje
function definirajDogadajeNakonAJAXa(){
	
	///////////////
  	/// DELETE
  	///////////////
	
	$(".brisanje").click(function(){
	    var json = {};
	    json["sifra"]=$(this).attr("id").split("_")[1];
		if(confirm("sigurno obrisati?")){
			ajax(putanjaAPI + "/obrisi",json);
		}
		return false;
	});
	
	///////////////
  	/// UPDATE
  	///////////////
	
	$(".promjena").click(function(){
		var sifra=$(this).attr("id").split("_")[1];
		$.getJSON(putanjaAPI + "/automobil/" + sifra, function( jsonData ) {
			jQuery.each(Object.entries(jsonData), function() {
				$("#" + this[0]).val(this[1]);
			});
			$('#modal').modal('show');	  			
		});
	});
}





///////////////
/// UTILITY
///////////////

function ajax(putanja,json){
	var podaci=JSON.stringify(json);
	$.ajax({
		type: 'POST',
	    url: putanja,
	    contentType: 'application/json; charset=utf-8',
	    data: JSON.stringify(json),
	    success: function(data){
	        if(data==="OK"){
	        	ucitaj();
	        	$('#modal').modal('hide');
	        }
	    }
	});
}

function postaviNaTablicu(jsonData){
	$("#podaci").html("");
	  $.each( jsonData, function( kljuc, operater ) {
	    $("#podaci").append("<tr>" + 
	    "<td>" + operater.sifra + "</td>" +
	    "<td>" + operater.ime + "</td>" +
	    "<td>" + operater.datum_proizvodnje + "</td>" +
	    "<td>" + operater.brzina + "</td>" +
	    "<td>" + operater.drzava + "</td>" +
	    "<td><a href=\"#\" class=\"promjena\" id=\"o_" + operater.sifra + "\">Promjena</a> | " +
	    "<a href=\"#\" class=\"brisanje\" id=\"o_" + operater.sifra + "\">Brisanje</a>"
	     + "</td>" +
	    "</tr>");
	  });
	  definirajDogadajeNakonAJAXa();
}


function trazi(){
	var uvjet=$("#uvjet").val();
	if(uvjet==""){
		uvjet="%20";
	}
	$.getJSON(putanjaAPI + "/search/" + uvjet, function( jsonData ) {
		postaviNaTablicu(jsonData);
	});
}
