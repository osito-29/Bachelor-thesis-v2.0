<?php 

$resultmessage="";

// process of email validation
if(isset($_GET["vkey"])){

    $resultmessage = "A jelszó megerősítése sikeres!";

    $vkey_from_mail = $_GET["vkey"];

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

    $sql = "SELECT verified,vkey FROM USERS WHERE (verified = 0 and vkey = '$vkey_from_mail')";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $sql_verify = "UPDATE USERS SET verified = 1 WHERE vkey = '$vkey_from_mail'";
        $result_verify = $conn->query($sql_verify);
    } else {
        $resultmessage = "A felhasználó nem létezik, vagy már meg lett erősítve!";
    }


$conn->close();

//header("location:validatesuccess.php");

} else {
    $resultmessage = "Hiba történt a megerősítés közben!";
}

?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <title>2D-s fémlemez hőtani szimulációja</title>
    <meta charset="UTF-8">
    <link rel="SHORTCUT ICON" href="http://femlemez.szakdoga.net/images/favicon2.png">
    <link href="css/style.css" rel="stylesheet" type="text/css">
    <style>
    button {background-color:darkred; color:lightgrey; padding:7px; font-weight:bold;}
    p    {text-align: center;}
    </style>
</head>
<body>
    <h1>2D-s fémlemez hőtani szimulációja</h1>
    <hr>
    <div style="background-color:darkred;"><span>&ensp;</span></div>
    <hr>
    <h2>
    <p><?= $resultmessage ?></p>
    </h2>
    <p>
    <button id="login" onclick="location.href='./login.php'" type="button">Bejelentkezés</button>
    </p>

</body>
</html>
