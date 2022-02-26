<?php

include_once('SQL_controller.php');

session_start();

if(!isset($_SESSION["loggedin"]) || ($_SESSION["loggedin"]=="")){

    header("location:index.php");
}

$materials = [];
$materials = get_materials_from_db($_SESSION["loggedin"]);

$savedfiles = [];
$savedfiles = get_filtered_data_from_db("SIMULATIONS", "FILENAME", "USERNAME", $_SESSION["loggedin"]);

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
    form    {text-align: center; margin: 0 auto;}
    p    {text-align: center;}
     table, tr, td {border: none; background-color: lightgrey; color:black;}
    .noborders {
    border-top-style: hidden;
    border-bottom-style: hidden;
    }
    </style>

</head>
<body>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<h1>A szimuláció adatainak megadása</h1>

<hr>
<div style="text-align:center; background-color:darkred; color:lightgrey;" >
<span class="material-icons" style="font-weight:bold;">person_outline</span>
<span>&ensp;</span>
<span id="sessionuser" style="font-style:italic; vertical-align:5px;"><?= $_SESSION["loggedin"] ?></span>
<span>&ensp;</span>
<a href="./logout.php" class="material-icons" style="color:lightgrey; text-decoration:none">logout</a>
</div>
<hr>

<div id="basisdata"><h2>A lemez alapadatai:</h2>

<table cellspacing="5" cellpadding ="5" align="center">
    <tr>
        <td><label>Szélesség: </label></td>
        <td><input id="sheetwidth" type="number" size="6" min="100" max ="500" value=100><label> mm</label></td>
        <td style="width:70px" class="noborders"></td>
        <td><label>Felbontás (hálóméret): </label></td>
        <td><input id="resolution" type="number" size="5" min="5" max ="20" value=10><label> mm</label></td>
    </tr>
    <tr>
        <td><label>Magasság: </label></td>
        <td><input id="sheetheight" type="number" size="6" min="100" max ="500" value=100><label> mm</label></td>
        <td class="noborders"></td>
        <td><label>Alapanyag: </label></td>
        <td>
        <select id ="materialslist" name="materialslist" onchange="show_material(this.value);">
        <option value="">Kiválaszt...</option>
        <?php foreach ($materials as $material) : ?>
            <option value="<?= $material ?>"><?= $material ?></option>
        <?php endforeach; ?>
        </select></td>
    </tr>
    <tr>
        <td><label>Hőmérséklet: </label></td>
        <td><input id="starttemp" type="number" size="4" min="0" max ="1000" value=25><label> °C</label></td>
        <td style="width:70px" class="noborders"></td>
        <td><label>Hővezetési tényező: </label></td>
        <td><label id="conductivitycond"> 0 </label><label> W/m·K</label></td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td><label>Sűrűség: </label></td>
        <td><label id="densitycond"> 0 </label><label> kg/m3</label></td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td><label>Fajhő: </label></td>
        <td><label id="heatcapacitycond"> 0 </label><label> kJ/kg·K</label></td>
    </tr>
    <tr>
        <td colspan="5" style="text-align: center;"><button id="confignewmaterialbtn">Új anyag hozzáadása az adatbázishoz</button></td>
    </tr>
    <tr id="newmaterialname" hidden>
        <td></td>
        <td colspan="2">Megnevezés:</td>
        <td><input id="materialname" name="materialname" type="text" size="15" value=""></td>
        <td></td>
    </tr>
    <tr id="newmaterialconductivity" hidden>
        <td></td>
        <td colspan="2">Hővezetési tényező:</td>
        <td><input id="conductivity" name="conductivity" type="number" size="10" min="0" max ="1000" step="0.1" value="40"><label> W/m·K</label></td>
        <td></td>
    </tr>

    <tr id="newmaterialdensity" hidden>
        <td></td>
        <td colspan="2">Sűrűség:</td>
        <td><input id="density" name="density" type="number" size="10" min="0" max ="25000" step="1" value="7800"><label> kg/m3</label></td>
    </tr>

    <tr id="newmaterialheatcapacity" hidden>
        <td></td>
        <td colspan="2">Fajhő:</td>
        <td><input id="heatcapacity" name="heatcapacity" type="number" size="10" min="0" max ="10" step="0.01" value="0.44"><label> kJ/kg·K</label></td>
    </tr>
    <tr id="newmaterialbuttons" hidden>
        <td colspan="2"></td>
        <td style="text-align: center;"><button id="cancelnewmaterialbtn">Mégse</button></td>
        <td style="text-align: center;"><button id="savenewmaterialbtn">Anyag mentése</button></td>
    </tr>
</table>

<br>
</div>
<hr>

<div id="constraints"><h2>Kezdeti és peremfeltételek:</h2>
<table cellspacing="5" cellpadding ="5" align="center">
    <tr>
        <td rowspan="2"><input id="heattransfer_cbox" type="checkbox"></td>
        <td rowspan="2"><label>Hőközlés helye:</label></td>
        <td><label>X: </label></td>
        <td><input id="heatsource_X" type="number" size="4" min="0" max ="500" step="1" value="0"><label> mm</label></td>
        <td style="width:40px" class="noborders"></td>
        <td rowspan="2"><label>Hőközlési hőmérséklet: </label></td>
        <td rowspan="2"><input id="heatingtemp" type="number" size="4" min="0" max ="1000" value=50><label> °C</label></td>
    </tr>
    <tr>
        <td><label>Y: </label></td>
        <td><input id="heatsource_Y" type="number" size="4" min="0" max ="500" step="1" value="0"><label> mm</label></td>
        <td class="noborders"></td>
    </tr>
</table><br>

<table cellspacing="5" cellpadding ="5" align="center">
    <tr>
        <td style="width:90px" class="noborders"></td>
        <td colspan="4"><label style="font-weight:bold; text-align:center;">Határoló élek hőmérséklete<label></td>
        <td style="width:90px" class="noborders"></td>
    </tr>

    <tr>
        <td colspan="2"></td>
        <td><label>Felső él:</label></td>
        <td><input id="toptemp" type="number" size="4" min="0" max ="1000" value="0"><label> °C</label></td>
    </tr>

    <tr>
        <td cospan="2"></td>
        <td></td>
        <td colspan="2" style="text-align: center;"><input id="toptemp_cbox" type="checkbox"></td>
    </tr>


    <tr>
        <td style="text-align:center;"><label>Balos él:</label>
        <br><br><input id="lefttemp" type="number" size="4" min="0" max ="1000" value="0"><label> °C</label></td>
        <td><input id="lefttemp_cbox" type="checkbox"></td>
        <td colspan="2"><img id="loading" src="images/square.png" alt="Fémlemez ábra" style="height:150px; width:150px;"></td>
        <td><input id="righttemp_cbox" type="checkbox" checked></td>
        <td style="text-align: center;"><label>Jobbos él:</label>
        <br><br><input id="righttemp" type="number" size="4" min="0" max ="1000" value="200"><label> °C</label></td>
    </tr>

    <tr>
        <td colspan="2"></td>
        <td colspan="2" style="text-align: center;"><input id="bottomtemp_cbox" type="checkbox" checked></td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td><label>Alsó él:</label></td>
        <td><input id="bottomtemp" type="number" size="4" min="0" max ="1000" value="240"><label> °C</label></td>
    </tr>
</table><br>

</div>
<hr>

<div id="simsettings"><h2>A szimuláció beállításai:</h2>

<div id="selectcalctype">
<table cellspacing="5" cellpadding ="5" align="center">
    <tr>
        <td><input type="radio" id="limitbytime" name="calctype" value="bytime" checked></td>
        <td><label>Időtartamig: </label></td>
        <td><input id="calctime" type="number" size="4" min="1" max ="100" step="0.1" value=30><label> s</label></td>
        <td style="width:30px" class="noborders"></td>
        <td><input type="radio" id="limitbytemp" name="calctype" value="bytemp"></td>
        <td><label>Állandósult állapotig, toleranciaszint:</label></td>
        <td><input id="tolerance" type="number" size="5" min="0.01" max ="10" step="0.01" value=0.1><label> °C</label></td>
    </tr>
</table>
</div>
</div><br>

<div id="senddata" align="center"><button id="senddatabtn">Szimuláció indítása a fenti adatokkal</button></div>

<div id="loadingpic_sendsim" align="center" hidden><br><img id="loading" src="images/loading.gif" alt="Töltés folyamatban" style="height:40px; width:40px;">
</div>
<br>
<hr>

<div id="prevsimsettings"><h2>Korábbi szimuláció megjelenítése:</h2>

<div id="selectfilename">
<table cellspacing="5" cellpadding ="5" align="center">
    <tr>
        <td style="width:10px" class="noborders"></td>
        <td><label>Fájlnév: </label></td>
        <td style="width:30px" class="noborders"></td>
        <td>
        <select id="prevsimname" name="prevsimname">
            <option value="latest">latest</option>
            <?php foreach ($savedfiles as $savedfile) : ?>
                <option value="<?= $savedfile ?>"><?= $savedfile ?></option>
            <?php endforeach; ?>
        </select>
        </td>
        <td style="width:10px" class="noborders"></td>
    </tr>
</table>    
</div>

</div>
<br>

<div id="getprevsim" align="center"><button id="getprevsimbtn">Korábbi szimuláció betöltése</button>
</div>

<div id="loadingpic_prevsim" align="center" hidden><br><img id="loading" src="images/loading.gif" alt="Töltés folyamatban" style="height:40px; width:40px;">
</div>

<div id="getresults" align="center" hidden>
<br>
<hr>    
<br><button id="getresultsbtn">Eredményeket megjelenít</button>
</div>

<div id="loadingpic" align="center" hidden><br><img id="loading" src="images/loading.gif" alt="Töltés folyamatban" style="height:40px; width:40px;">
</div>

</div>

<div id="simresults" align="center" hidden>
<br>
<hr>
<div style="background-color:darkred;"><span>&ensp;</span></div>
<hr>
<h1>A szimuláció eredményei</h1>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<table cellspacing="10" cellpadding ="1" align="center">
    <tr>
        <td><button id="fastbackwardbtn"><i class="fa fa-fast-backward"></i></button></td>
        <td><button id="stepbackwardbtn"><i class="fa fa-step-backward"></i></button></td>
        <td><button id="stopbtn"><i class="fa fa-stop"></i></button></td>
        <td><button id="playbtn"><i class="fa fa-play"></i></button></td>
        <td><button id="pausebtn"><i class="fa fa-pause"></i></button></td>
        <td><button id="stepforwardbtn"><i class="fa fa-step-forward"></i></button></td>
        <td><button id="fastforwardbtn"><i class="fa fa-fast-forward"></i></button></td>
    </tr>
</table>
<br>

<input id="elapsedtimerange" type="range" min="0" max="50" value="0"><br>

<label>Eltelt idő: </label><input id="elapsedtime" type="text" value="0" size="3" disabled><label> sec</label><br>
<br>

<canvas id="simcanvas" width="500" height="500" style="border:1px solid #000000;">
</canvas>


<br><br>

<img id="indicator" src="images/indicator.jpg" alt="Hőmérséklet skála" style="height:20px; width:470px;">

<table cellspacing="5" cellpadding ="5" align="center" style="width:470px">
    <tr>
        <td><label>Minimum:  </label></td>
        <td><input id="mintemp" type="text" value="28" size="4" disabled></td>
        <td><label> °C</label></td>
        <td style="width:40px" class="noborders"></td>
        <td><label>Maximum:  </label></td>
        <td><input id="maxtemp" type="text" value="70" size="4" disabled></td>
        <td><label> °C</label></td>
    </tr>
    <tr>
        <td colspan="7" style="text-align: center;"><label style="font-weight:bold;">A kiválasztott pont adatai</td>
    </tr>
    <tr>
        <td style="text-align: right;"><label>X:  </label></td>
        <td><input id="picked_x" type="text" value="0" size="4" disabled></td>
        <td><label> mm</label></td>
        <td style="width:40px" class="noborders"></td>
        <td><label>Időpillanat:</label></td>
        <td><input id="picked_time" type="text" value="0" size="4" disabled></td>
        <td><label> sec</label></td>
    </tr>
    <tr>
        <td style="text-align: right;"><label>Y:  </label></td>
        <td><input id="picked_y" type="text" value="0" size="4" disabled></td>
        <td><label> mm</label></td>
        <td style="width:40px" class="noborders"></td>
        <td><label>Hőmérséklet:  </label></td>
        <td><input id="picked_temp" type="text" value="0" size="4" disabled></td>
        <td><label> °C</label></td>
    </tr>
    <tr>
        <td colspan="3" style="text-align:left"><button id="saveindatabasebtn">Mentés adatbázisba</button></td>
        <td colspan="2" class="noborders" style="text-align:right"><button id="downloadjsonbtn" type="submit" onclick="">JSON letöltése</button></td>
        <td colspan="2" style="text-align:center"><button id="downloadvideobtn" type="submit" onclick="">Video letöltése</button></td>
    </tr>
</table>

<div id="loadingpic_download" align="center" hidden><br><img id="loading" src="images/loading.gif" alt="Töltés folyamatban" style="height:40px; width:40px;">
</div>
<br>
<div id=recording_video hidden>
<canvas id="video_canvas" width="500" height="500" style="border:1px solid #000000;">
</canvas>


</div>
    <script type="module" src="javascripts/Simulation.js"></script>
</body>
</html>