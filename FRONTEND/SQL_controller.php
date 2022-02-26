<?php

function get_data_from_db($databasename, $selectedcolumn){

    $host_db="localhost";
    $user_db="femlemezdb";
    $pass_db="femlemezdb";
    $dbname_db="femlemezdb";
    
    $all_data = [];
    
    $conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $sql = "SELECT * FROM $databasename";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
    
        while($row = $result->fetch_assoc()){
            $all_data[] = $row["$selectedcolumn"];
        }
    }
    
    $conn->close();
    
    return $all_data;
}

function get_filtered_data_from_db($databasename, $selectedcolumn, $filtercolumn, $parameter){

    $host_db="localhost";
    $user_db="femlemezdb";
    $pass_db="femlemezdb";
    $dbname_db="femlemezdb";
    
    $all_data = [];
    
    $conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $sql = "SELECT * FROM $databasename WHERE $filtercolumn = '$parameter'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
    
        while($row = $result->fetch_assoc()){
            $all_data[] = $row["$selectedcolumn"];
        }
    }
    
    $conn->close();
    
    return $all_data;
}


function insert_data_into_database($table, $parameter, $value){

    $host_db="localhost";
    $user_db="femlemezdb";
    $pass_db="femlemezdb";
    $dbname_db="femlemezdb";
    
    $all_data = [];
    
    $conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
   
    $sql = "INSERT INTO $table(name, conductivity) VALUES ('$parameter','$value')";

    if ($conn->query($sql) === TRUE) {
//        echo "Bejegyzes sikeresen mentve";
        $refreshed_table = get_data_from_db("MATERIALS", "NAME");        
      } else {
        echo "Hiba: " . $sql . "<br>" . $conn->error;
      }
  
    $conn->close();

    return $refreshed_table;
}

function get_materials_from_db($username){

    $host_db="localhost";
    $user_db="femlemezdb";
    $pass_db="femlemezdb";
    $dbname_db="femlemezdb";

    $conn = new mysqli($host_db, $user_db, $pass_db, $dbname_db);
    $conn->set_charset('utf8mb4');

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    if($username=="admin"){
        $sql = "SELECT * FROM MATERIALS WHERE USERNAME = '$username'";
    } else {
        $sql = "SELECT * FROM MATERIALS WHERE USERNAME = '$username' OR USERNAME = 'admin'";
    }

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            $all_data[] = $row['NAME'];
        }
    }

    $conn->close();

    return $all_data;
}

?>