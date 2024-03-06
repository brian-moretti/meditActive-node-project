CREATE TABLE `goal`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `goal` ADD UNIQUE `goal_title_unique`(`title`);
CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
CREATE TABLE `interval-target`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date_start` DATE NOT NULL,
    `date_end` DATE NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `target_id` BIGINT UNSIGNED NOT NULL
);
ALTER TABLE
    `interval-target` ADD INDEX `interval_target_user_id_index`(`user_id`);
ALTER TABLE
    `interval-target` ADD INDEX `interval_target_goal_id_index`(`goal_id`);

ALTER TABLE
    `interval-target` ADD CONSTRAINT `interval_target_goal_id_foreign` FOREIGN KEY(`goal_id`) REFERENCES `goal`(`id`);
ALTER TABLE
    `interval-target` ADD CONSTRAINT `interval_target_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);