USE ethereal_company;

ALTER TABLE `Logbook_Table`
ADD COLUMN `org_supervisor_rating` INT NULL DEFAULT NULL AFTER `org_supervisor_comment`;

CREATE TABLE IF NOT EXISTS `Student_Evaluation_Table` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT UNSIGNED NOT NULL,
    `org_supervisor_id` BIGINT NOT NULL,
    `attendance_score` VARCHAR(5) NOT NULL,
    `attitude_score` VARCHAR(5) NOT NULL,
    `work_quality_score` VARCHAR(5) NOT NULL,
    `independence_score` VARCHAR(5) NOT NULL,
    `professionalism_score` VARCHAR(5) NOT NULL,
    `communication_score` VARCHAR(5) NOT NULL,
    `leadership_score` VARCHAR(5) NOT NULL,
    `total_score` INT NOT NULL,
    `final_remarks` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `Student_Table`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
