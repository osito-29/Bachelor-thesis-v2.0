<?php

//start new session and remove session data
session_start();
$_SESSION["loggedin"] = "";

header("location:index.php");

?>