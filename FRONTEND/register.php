<?php

function get_value($name) {
    if (empty($_POST[$name])) {
        return '';
    }

    return $_POST[$name];
}

$errors = [];
$email_exists = false;
$username_exists = false;

if ($_POST)
{
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $repassword = $_POST['repassword'];

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

if ($result->num_rows > 0) {
    $username_exists = true;
} 

$conn->close();

//end of Mysql connection

    if (empty($username))
    {
        $errors[] = 'Nincs megadva felhasználónév!';
    }

    else if(strlen($username)<5)
    {
        $errors[] = 'A felhasználónév minimum 5 karakter hosszúságú legyen!';
    }

    else if ($username_exists)
    {
        $errors[] = 'Ezzel a névvel már van regisztrált felhasználó!';
    }

    if (empty($email))
    {
        $errors[] = 'Nincs kitöltve az e-mail cím!';
    }

    else if (!strpos($email,"@"))
    {
        $errors[] = 'Nem helyes e-mail formátum!';
    }

    if (empty($password))
    {
        $errors[] = 'Nincs kitöltve a jelszó!';
    }

    if (empty($repassword))
    {
        $errors[] = 'Nincs kitöltve a jelszó megerősítése!';
    }

    if ($password !== $repassword)
    {
        $errors[] = 'A jelszó és a megerősítése nem egyezik!';
    }

}

$valid = FALSE;

if (empty($errors) && $_POST)
{
    $valid = TRUE;
}

if ($valid)
{

    #generate the verification code
    $vkey = md5(time().$username);

    #create mysql connection

    $host_db="localhost";
    $user_db="femlemezdb";
    $pass_db="femlemezdb";
    $dbname_db="femlemezdb";
    
    $conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sec_password = md5($password);

    
    $sql = "INSERT INTO USERS(username, password, email, vkey) VALUES ('$username','$sec_password', '$email', '$vkey')";

    if ($conn->query($sql) === TRUE) {
        echo "Bejegyzes sikeresen mentve";
      } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
      }
  
    $conn->close();


    #close mysql connection


    $to = $email;
    $subject = "Emailcím megerősítése - Fémlemez szimuláció";

    $message = '
    <html>
    <head>
    <title>E-mailcím megerősítése</title>
        <style>
        h1    {text-align: center;}
        h2    {text-align: center;}
        p    {text-align: center;}
        </style>
    </head>
    <body>
    <hr>
    <div style="background-color:darkred;"><span>&ensp;</span></div>
    <hr>
    <h1>Köszönjük hogy regisztrált az oldalra!</h1>
    <h2><p>A regisztráció megerősítéséhez kattintson <a href="http://femlemez.szakdoga.net/validatemail.php?vkey='.$vkey.'">ide</a>!</p></h2>
    <hr>
    <div style="background-color:darkred;"><span>&ensp;</span></div>
    <hr>
    </body>
    </html>
    ';

    $headers = "MIME-Version: 1.0" . "\r\n"; 
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    $headers .= "From: info@femlemez.szakdoga.net";

    mail($to, $subject, $message, $headers);

    #send verification e-mail

    header("location:regsuccess.php");
}

?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <title>2D-s fémlemez hőtani szimulációja - regisztráció</title>
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
    <h2><p>Regisztráció</p></h2>

    <ul>
        <?php foreach ($errors as $error) : ?>
        <li><?= $error ?></li>
        <?php endforeach; ?>
    </ul>
    <form method="POST" novalidate>
        <table cellspacing="5" cellpadding ="10">
            <tr>
                <td><label>Felhasználónév</label></td>
                <td><input type="text" name="username" value="<?= get_value('username') ?>"></td>
            </tr>
            <tr>
                <td><label>E-mail cím</label></td>
                <td><input type="text" name="email" value="<?= get_value('email') ?>"></td>
            </tr>
            <tr>
                <td><label>Jelszó</label></td>
                <td><input type="password" name="password" value="<?= get_value('password') ?>"></td>
            </tr>
            <tr>
                <td><label>Jelszó megerősítése</label></td>
                <td><input type="password" name="repassword" value="<?= get_value('repassword') ?>"></td>
            </tr>
        </table><br>
        <button type="submit">Elküld</button>
    </form>
</body>
</html>
