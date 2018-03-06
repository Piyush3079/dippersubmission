CREATE TABLE `tweets` (
  `id` bigint(19) NOT NULL AUTO_INCREMENT,
  `tw_id` bigint(19) NOT NULL,
  `text` varchar(255) NOT NULL,
  `id_user` bigint(19) NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  `retweeted` bigint(19) NOT NULL,
  `string` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2871 DEFAULT CHARSET=utf8

CREATE TABLE `user` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `t_id` bigint(12) NOT NULL,
  `token` varchar(255) NOT NULL,
  `token_secret` varchar(255) NOT NULL,
  `screen_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `twitte_id` (`t_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8

CREATE TABLE `query` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(19) NOT NULL,
  `string` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `string_search` (`string`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8

CREATE TABLE `tweet_user` (
  `id` bigint(19) NOT NULL AUTO_INCREMENT,
  `twu_id` bigint(19) NOT NULL,
  `name` varchar(255) NOT NULL,
  `screen_name` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `followers_count` int(10) DEFAULT NULL,
  `friends_count` int(10) DEFAULT NULL,
  `status_count` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `twu_id` (`twu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2673 DEFAULT CHARSET=utf8

CREATE TABLE `rtweeted_user` (
  `id` bigint(19) NOT NULL AUTO_INCREMENT,
  `rtu_id` bigint(19) NOT NULL,
  `name` varchar(255) NOT NULL,
  `screen_name` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `followers_count` int(10) DEFAULT NULL,
  `friends_count` int(10) DEFAULT NULL,
  `status_count` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rtu_id` (`rtu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1284 DEFAULT CHARSET=utf8