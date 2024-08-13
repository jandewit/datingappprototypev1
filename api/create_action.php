<?php
    error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    include_once 'db.php';
    include_once 'action.php';
    include_once 'participant.php';
    $database = new Database();
    $db = $database->getConnection();
    $p = new Participant($db);
    $item = new Action($db);
    $data = $_POST;

    $p->random_id = $data['random_id'];
    $part_id = $p->getSingleParticipant();

    //print_r($part_id);
    //echo $part_id.'joe';
    //echo $part_id->participant_id;

    $item->participant_id = $part_id;
    $item->picture_id = $data['picture_id'];
    $item->name = $data['name'];
    $item->order_id = $data['order_id'];
    $item->is_liked = $data['is_liked'];

    if($item->createAction()){
        echo '{"status": "OK"}';
    } else{
        echo 'Error';
    }
?>
