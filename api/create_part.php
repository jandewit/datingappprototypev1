<?php
    error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    include_once 'db.php';
    include_once 'participant.php';
    $database = new Database();
    $db = $database->getConnection();
    $item = new Participant($db);
    $data = $_POST;

    $item->random_id = md5('yoo' . strval(time()) . '123hdnv');
    $item->qualtrics_id = $data['qualtrics_id'];
    $item->exp_condition = $data['exp_condition'];
    $item->gender_profiles = $data['gender_profiles'];
    $item->created = date('Y-m-d H:i:s');

    if($item->createParticipant()){
        echo '{"id": "' . $item->random_id . '"'.'}';
    } else{
        echo 'Error';
    }
?>
