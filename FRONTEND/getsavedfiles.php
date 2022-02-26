<?php

$username = $_GET['username'];

$host_db="localhost";
$user_db="femlemezdb";
$pass_db="femlemezdb";
$dbname_db="femlemezdb";

$conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM SIMULATIONS WHERE USERNAME = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo ("<option value="."latest".">latest</option>");
    while($row = $result->fetch_assoc()){
            echo ("<option value=".$row['FILENAME'].">");
            echo $row['FILENAME'];
            echo ("</option>");
    }
}

$conn->close();

?>