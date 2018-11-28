<?php
require 'flight/Flight.php';

Flight::route('/', function(){
    echo 'hello world!';
});

//SELECT
Flight::route('/automobil', function(){
    $veza = Flight::db();
	$izraz = $veza->prepare("select sifra, ime, datum_proizvodnje, brzina, drzava from auto");
    $izraz->execute();
    echo json_encode($izraz->fetchAll(PDO::FETCH_OBJ));
});

//INSERT CREATE
Flight::route('POST /noviAutomobil', function(){
	$o = json_decode(file_get_contents('php://input'));
	$veza = Flight::db();
	$izraz = $veza->prepare("insert into auto (ime, datum_proizvodnje, brzina, drzava) values (:ime, :datum_proizvodnje, :brzina, :drzava)");
	$izraz->execute((array)$o);
	echo "OK";
});
    Flight::route('/automobil/@id', function($sifra){
        $veza = Flight::db();
        $izraz = $veza->prepare("select sifra, ime, datum_proizvodnje, brzina, drzava from auto where sifra=:sifra");
        $izraz->execute(array("sifra" => $sifra));
        echo json_encode($izraz->fetch(PDO::FETCH_OBJ));
    });
//UPDATE
Flight::route('POST /update', function(){
	$o = json_decode(file_get_contents('php://input'));
	$veza = Flight::db();
	$izraz = $veza->prepare("update auto set ime=:ime, datum_proizvodnje=:datum_proizvodnje, brzina=:brzina, drzava=:drzava where sifra=:sifra;");
	$izraz->execute((array)$o);
	echo "OK";
});


//DELETE
Flight::route('POST /obrisi', function(){
	$o = json_decode(file_get_contents('php://input'));
	$veza = Flight::db();
	$izraz = $veza->prepare("delete from auto where sifra=:sifra;");
	$izraz->execute((array)$o);
	echo "OK";
});

//utility
Flight::map('notFound', function(){
	$poruka=new stdClass();
	$poruka->status="404";
	$poruka->message="Not found";
	echo json_encode($poruka);
 });


//Search
Flight::route('/search/@uvjet', function($uvjet){
	$veza = Flight::db();
	$izraz = $veza->prepare("select sifra, ime, datum_proizvodnje, brzina, drzava from auto where concat(ime, datum_proizvodnje, brzina, drzava) like :uvjet");
	$izraz->execute(array("uvjet" => "%" . $uvjet . "%"));
	echo json_encode($izraz->fetchAll(PDO::FETCH_OBJ));
});

//LOKALNO
Flight::register('db', 'PDO', array('mysql:host=localhost;dbname=automobil;charset=UTF8','root',''));
//SERVER
//Flight::register('db', 'PDO', array('mysql:host=localhost;dbname=jzilic_P3;charset=UTF8','jzilic','d91db55b'));

Flight::start(); 
