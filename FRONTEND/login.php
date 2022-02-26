<?php

session_start();

function get_value($name) {
    if (empty($_POST[$name])) {
        return '';
    }

    return $_POST[$name];
}

$errors = [];

if ($_POST)
{

    $username = $_POST['username'];
    $password = $_POST['password'];

    $sec_password = md5($password);

    if (empty($username))
    {
        $errors[] = 'Nincs megadva felhasználónév!';
    }

    if (empty($password))
    {
        $errors[] = 'Nincs kitöltve a jelszó!';
    }

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

$sql = "SELECT * FROM USERS WHERE USERNAME = '$username'";
$result = $conn->query($sql);

if ($result->num_rows ==0){
    $errors[] = 'Hibás felhasználónév vagy jelszó!';
}

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();
    if($row['password'] == $sec_password){

        if ($row['verified']==0){

            $errors[] = 'Felhasználó nincs megerősítve!';
        }

    }
    else {
        $errors[] = 'Hibás felhasználónév vagy jelszó!';
    }
}

$conn->close();

//end of Mysql connection
}

$valid = FALSE;

if (empty($errors) && $_POST)
{
    $valid = TRUE;
}

if ($valid)
{
    $_SESSION["loggedin"] = $username;

    header("location:calculation.php");

}

?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <title>2D-s fémlemez hőtani szimulációja - bejelentkezés</title>
    <meta charset="UTF-8">
    <link rel="SHORTCUT ICON" href="http://femlemez.szakdoga.net/images/favicon2.png">
    <link href="css/style.css" rel="stylesheet" type="text/css">
    <style>
    button {background-color:darkred; color:lightgrey; padding:7px; font-weight:bold;}
    form    {text-align: center; margin: 0 auto;}
    p    {text-align: center;}
    table, tr, td {border: 2px solid lightgrey;}
    </style>
</head>
<body>
    <h1>2D-s fémlemez hőtani szimulációja</h1>
    <hr>
    <div style="background-color:darkred;"><span>&ensp;</span></div>
    <hr>
    <h2><p>Bejelentkezés</p></h2>

    <ul>
        <?php foreach ($errors as $error) : ?>
        <li><?= $error ?></li>
        <?php endforeach; ?>
    </ul>
    <form method="POST" novalidate>
        <table cellspacing="5" cellpadding ="5">
            <tr>
                <td><label>Felhasználónév</label></td>
                <td><input type="text" name="username" value="<?= get_value('username') ?>"></td>
            </tr>
            <tr>
                <td><label>Jelszó</label></td>
                <td><input type="password" name="password" value="<?= get_value('password') ?>"></td>
            </tr>
        </table><br>
        <button type="submit">Bejelentkezés</button>
        <button id ="register" onclick="location.href='./register.php'" type="button">Regisztráció</button>
    </form>

</body>
</html>