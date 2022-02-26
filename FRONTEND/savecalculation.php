<?php

$username = $_GET['username'];
$filename = $_GET['filename'];

//create Mysql connection

$host_db="localhost";
$user_db="femlemezdb";
$pass_db="femlemezdb";
$dbname_db="femlemezdb";

$conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM SIMULATIONS WHERE USERNAME = '$username' AND FILENAME = '$filename'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

  echo "A számítás ( "."$filename"." ) már létezik az adatbázisban, újbóli mentés sikertelen";

} else {

    $sql = "INSERT INTO SIMULATIONS(username, filename) VALUES ('$username','$filename')";
    if ($conn->query($sql) === TRUE) {
      echo "Utolsó számítás ( "."latest"." ) mentve mint: ".$filename ;

    } else {
      echo ("Adatbázis hiba, mentés sikertelen");
    }
}

$conn->close();

?>