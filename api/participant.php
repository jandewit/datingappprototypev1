<?php
    error_reporting(E_ALL ^ E_WARNING ^ E_DEPRECATED);

    class Participant {
        // Connection
        private $conn;
        // Table
        private $db_table = "participant";
        // Columns
        public $random_id;
        public $qualtrics_id;
        public $exp_condition;
        public $gender_profiles;
        public $created;

        // Db connection
        public function __construct($db){
            $this->conn = $db;
        }

        public function createParticipant(){
            $sqlQuery = "INSERT INTO
                        ". $this->db_table ."
                    SET
                        random_id = :random_id,
                        qualtrics_id = :qualtrics_id,
                        exp_condition = :exp_condition,
                        gender_profiles = :gender_profiles,
                        created = :created";

            $stmt = $this->conn->prepare($sqlQuery);

            // sanitize
            $this->random_id=htmlspecialchars(strip_tags($this->random_id));
            $this->qualtrics_id=htmlspecialchars(strip_tags($this->qualtrics_id));
            $this->exp_condition=htmlspecialchars(strip_tags($this->exp_condition));
            $this->gender_profiles=htmlspecialchars(strip_tags($this->gender_profiles));
            $this->created=htmlspecialchars(strip_tags($this->created));

            // bind data
            $stmt->bindParam(":random_id", $this->random_id);
            $stmt->bindParam(":qualtrics_id", $this->qualtrics_id);
            $stmt->bindParam(":exp_condition", $this->exp_condition);
            $stmt->bindParam(":gender_profiles", $this->gender_profiles);
            $stmt->bindParam(":created", $this->created);

            if($stmt->execute()){
               return true;
            }
            return false;
        }

        public function getSingleParticipant(){
              $sqlQuery = "SELECT
                          participant_id
                        FROM
                          ". $this->db_table ."
                      WHERE
                         random_id = ?
                      LIMIT 0,1";
              $stmt = $this->conn->prepare($sqlQuery);
              $stmt->bindParam(1, $this->random_id);
              $stmt->execute();
              $dataRow = $stmt->fetch(PDO::FETCH_ASSOC);

              return $dataRow['participant_id'];
          }
    }
?>
