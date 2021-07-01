<?php
//DB System.
//**************************************************************************************
$dbSystemHost = "192.175.105.180";
$dbSystemDataBase = "rel_db_r2";
$dbSystemUser = "radsquare";
$dbSystemPassword = "fEli#3006";


//PDO - Connection for various types of data bases.
try
{
    $dbSystemConPDO = new PDO("mysql:host=" . $dbSystemHost . ";dbname=" . $dbSystemDataBase . "", $dbSystemUser, $dbSystemPassword);
	$dbSystemConPDO->exec("set names utf8");
	$dbSystemConPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //Show errors.
}catch(PDOException $DBSystemErrorPDO) {
    //print "Error!: " . $erroDBPDO->getMessage() . "<br/>";
    die("DB Error: " . $DBSystemErrorPDO->getMessage() . "<br />");
}
//**************************************************************************************
?>