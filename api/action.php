<?php
    error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);

    class Action {
        // Connection
        private $conn;
        // Table
        private $db_table = "action";
        // Columns
        public $participant_id;
        public $picture_id;
        public $name;
        public $order_id;
        public $is_liked;

        // Db connection
        public function __construct($db){
            $this->conn = $db;
        }

        public function createAction(){
            $sqlQuery = "INSERT INTO
                        ". $this->db_table ."
                    SET
                        participant_id = :participant_id,
                        picture_id = :picture_id,
                        name = :name,
                        order_id = :order_id,
                        is_liked = :is_liked";

            $stmt = $this->conn->prepare($sqlQuery);

            // sanitize
            $this->participant_id=htmlspecialchars(strip_tags($this->participant_id));
            $this->picture_id=htmlspecialchars(strip_tags($this->picture_id));
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->order_id=htmlspecialchars(strip_tags($this->order_id));
            $this->is_liked=htmlspecialchars(strip_tags($this->is_liked));

            // bind data
            $stmt->bindParam(":participant_id", $this->participant_id);
            $stmt->bindParam(":picture_id", $this->picture_id);
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":order_id", $this->order_id);
            $stmt->bindParam(":is_liked", $this->is_liked);

            if($stmt->execute()){
               return true;
            }
            return false;
        }

    }
?>
