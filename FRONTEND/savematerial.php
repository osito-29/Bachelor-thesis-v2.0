<?php

header('Content-Type: text/html; charset=utf-8');

$username = $_GET['username'];
$materialname = $_GET['materialname'];
$conductivity = $_GET['conductivity'];
$density = $_GET['density'];
$heatcapacity = $_GET['heatcapacity'];

$host_db="localhost";
$user_db="femlemezdb";
$pass_db="femlemezdb";
$dbname_db="femlemezdb";

$conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
$conn->set_charset('utf8mb4'); 

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM MATERIALS WHERE NAME = '$materialname' AND (USERNAME = '$username' OR USERNAME ='admin')";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

  echo "A(z) ".$materialname." nevű anyag már létezik az adatbázisban, újbóli mentés sikertelen";

} else {

    $sql = "INSERT INTO MATERIALS(USERNAME, NAME, CONDUCTIVITY, DENSITY, HEATCAPACITY) VALUES ('$username','$materialname','$conductivity','$density','$heatcapacity')";
    if ($conn->query($sql) === TRUE) {
      echo "Anyag mentve ".$username." felhasználó részére az alábbi néven: ".$materialname ;

    } else {
      echo ("Adatbázis hiba, mentés sikertelen");
    }
}

$conn->close();

?>