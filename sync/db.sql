-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: elaundry
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `linen_rfids`
--

DROP TABLE IF EXISTS `linen_rfids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linen_rfids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfid` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `linen_rfids_unique` (`rfid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linen_rfids`
--

LOCK TABLES `linen_rfids` WRITE;
/*!40000 ALTER TABLE `linen_rfids` DISABLE KEYS */;
INSERT INTO `linen_rfids` VALUES (2,'RFID1','2024-11-16 14:25:35'),(3,'RFID2','2024-11-16 16:34:01'),(4,'RFID3','2024-11-16 16:34:05'),(5,'RFID4','2024-11-16 16:39:53');
/*!40000 ALTER TABLE `linen_rfids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linen_types`
--

DROP TABLE IF EXISTS `linen_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linen_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `linen_types_unique` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linen_types`
--

LOCK TABLES `linen_types` WRITE;
/*!40000 ALTER TABLE `linen_types` DISABLE KEYS */;
INSERT INTO `linen_types` VALUES (2,'TYPE LINEN B'),(4,'TYPE LINEN C');
/*!40000 ALTER TABLE `linen_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linens`
--

DROP TABLE IF EXISTS `linens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_room` int DEFAULT NULL,
  `id_rfid` int DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `linens_unique` (`id_rfid`),
  KEY `linens_rooms_FK` (`id_room`),
  KEY `linens_is_active_IDX` (`is_active`) USING BTREE,
  CONSTRAINT `linens_linen_rfids_FK` FOREIGN KEY (`id_rfid`) REFERENCES `linen_rfids` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `linens_rooms_FK` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linens`
--

LOCK TABLES `linens` WRITE;
/*!40000 ALTER TABLE `linens` DISABLE KEYS */;
INSERT INTO `linens` VALUES (1,1,NULL,'TYPE1',0,'2024-11-16 14:25:35'),(3,1,NULL,'TYPE1',0,'2024-11-16 14:27:20'),(6,NULL,5,'TYPE1',1,'2024-11-16 16:33:55'),(7,1,NULL,'TYPE2',0,'2024-11-16 16:34:01'),(8,1,4,'TYPE2',1,'2024-11-16 16:34:05');
/*!40000 ALTER TABLE `linens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfid_clients`
--

DROP TABLE IF EXISTS `rfid_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfid_clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rfid_client_unique` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfid_clients`
--

LOCK TABLES `rfid_clients` WRITE;
/*!40000 ALTER TABLE `rfid_clients` DISABLE KEYS */;
INSERT INTO `rfid_clients` VALUES (1,'DEMO');
/*!40000 ALTER TABLE `rfid_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` varchar(100) NOT NULL,
  `tipe` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rooms_unique` (`room`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'RUANGAN EDITED',''),(4,'TES RUANGAN 3','OK'),(6,'TES RUANGAN 4','OK');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_role` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_unique` (`username`),
  KEY `users_roles_FK` (`id_role`),
  CONSTRAINT `users_roles_FK` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Admin',NULL),(7,1,'nopal2',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `washings`
--

DROP TABLE IF EXISTS `washings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `washings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_linen` int NOT NULL,
  `from_room` int DEFAULT NULL,
  `status` enum('out_room','in_laundry','out_laundry','in_room') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `finished_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `washings_rooms_FK` (`from_room`),
  KEY `washings_linens_FK` (`id_linen`),
  CONSTRAINT `washings_linens_FK` FOREIGN KEY (`id_linen`) REFERENCES `linens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `washings_rooms_FK` FOREIGN KEY (`from_room`) REFERENCES `rooms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `washings`
--

LOCK TABLES `washings` WRITE;
/*!40000 ALTER TABLE `washings` DISABLE KEYS */;
INSERT INTO `washings` VALUES (2,6,NULL,'in_room','2024-11-28 21:00:36','2024-11-28 21:03:24'),(3,6,NULL,'in_room','2024-11-28 21:03:43','2024-11-28 21:16:29'),(4,6,1,'in_room','2024-11-28 21:19:04','2024-11-28 21:19:21'),(5,6,1,'in_room','2024-11-28 21:23:35','2024-11-28 21:23:35'),(6,6,1,'in_room','2024-11-28 21:23:35','2024-11-28 21:45:59'),(7,6,1,'in_room','2024-11-28 21:46:00','2024-11-28 21:46:00'),(8,6,1,'in_room','2024-11-28 21:46:00','2024-11-28 21:47:12'),(9,6,1,'in_room','2024-11-28 21:47:12','2024-11-28 21:47:12'),(10,6,1,'in_room','2024-11-28 21:47:12','2024-11-28 21:49:07'),(11,6,1,'in_room','2024-11-28 21:49:07','2024-11-28 21:49:08'),(12,6,1,'in_room','2024-11-28 21:49:08','2024-11-28 21:49:08'),(13,6,1,'in_room','2024-11-28 21:49:08','2024-11-28 21:49:09'),(14,6,1,'in_room','2024-11-28 21:49:09','2024-11-28 21:49:09'),(15,6,1,'in_room','2024-11-28 21:49:09','2024-11-28 21:49:10'),(16,6,1,'in_room','2024-11-28 21:49:10','2024-11-28 21:49:10'),(17,6,1,'in_room','2024-11-28 21:49:10','2024-11-28 21:49:10'),(18,6,1,'in_room','2024-11-28 21:49:11','2024-11-28 21:49:11'),(19,6,1,'in_room','2024-11-28 21:49:11','2024-11-28 21:49:11'),(20,6,1,'in_room','2024-11-28 21:49:11','2024-11-28 21:49:12'),(21,6,1,'in_room','2024-11-28 21:49:12','2024-11-28 21:49:12'),(22,6,1,'in_room','2024-11-28 21:49:12','2024-11-28 21:49:13'),(23,6,1,'in_room','2024-11-28 21:49:13','2024-11-28 21:49:13'),(24,6,1,'in_room','2024-11-28 21:49:13','2024-11-28 21:49:13'),(25,6,1,'in_room','2024-11-28 21:49:14','2024-11-28 21:49:14'),(26,6,1,'in_room','2024-11-28 21:49:14','2024-11-28 21:49:14'),(27,6,1,'in_room','2024-11-28 21:49:14','2024-11-28 21:49:15'),(28,6,1,'in_room','2024-11-28 21:49:15','2024-11-28 21:49:15'),(29,6,1,'in_room','2024-11-28 21:49:15','2024-11-28 21:49:16'),(30,6,1,'in_room','2024-11-28 21:49:16','2024-11-28 21:49:16'),(31,6,1,'in_room','2024-11-28 21:49:16','2024-11-28 21:49:16'),(32,6,1,'in_room','2024-11-28 21:49:17','2024-11-28 21:49:17'),(33,6,1,'in_room','2024-11-28 21:49:17','2024-11-28 21:49:17'),(34,6,1,'in_room','2024-11-28 21:49:17','2024-11-28 21:49:18'),(35,6,1,'in_room','2024-11-28 21:49:18','2024-11-28 21:49:18'),(36,6,1,'in_room','2024-11-28 21:49:18','2024-11-28 21:49:19'),(37,6,1,'in_room','2024-11-28 21:49:19','2024-11-28 21:49:19'),(38,6,1,'in_room','2024-11-28 21:49:19','2024-11-28 21:49:19'),(39,6,1,'in_room','2024-11-28 21:49:20','2024-11-28 21:49:20'),(40,6,1,'in_room','2024-11-28 21:49:20','2024-11-28 21:49:20'),(41,6,1,'in_room','2024-11-28 21:49:20','2024-11-28 21:49:21'),(42,6,1,'in_room','2024-11-28 21:49:21','2024-11-28 21:49:21'),(43,6,1,'in_room','2024-11-28 21:49:21','2024-11-28 21:49:21'),(44,6,1,'in_room','2024-11-28 21:49:22','2024-11-28 21:49:22'),(45,6,1,'in_room','2024-11-28 21:49:22','2024-11-28 21:49:22'),(46,6,1,'in_room','2024-11-28 21:49:22','2024-11-28 21:49:23'),(47,6,1,'in_room','2024-11-28 21:49:23','2024-11-28 21:49:23'),(48,6,1,'in_room','2024-11-28 21:49:23','2024-11-28 21:49:23'),(49,6,1,'in_room','2024-11-28 21:49:24','2024-11-28 21:49:24'),(50,6,1,'in_room','2024-11-28 21:49:24','2024-11-28 21:49:24'),(51,6,1,'in_room','2024-11-28 21:49:24','2024-11-28 21:49:25'),(52,6,1,'in_room','2024-11-28 21:49:25','2024-11-28 21:49:25'),(53,6,1,'in_room','2024-11-28 21:49:25','2024-11-28 21:49:26'),(54,6,1,'in_room','2024-11-28 21:49:26','2024-11-28 21:49:26'),(55,6,1,'in_room','2024-11-28 21:49:26','2024-11-28 21:49:26'),(56,6,1,'in_room','2024-11-28 21:49:26','2024-11-28 21:49:27'),(57,6,1,'in_room','2024-11-28 21:49:27','2024-11-28 21:49:27'),(58,6,1,'in_room','2024-11-28 21:49:27','2024-11-28 21:49:28'),(59,6,1,'in_room','2024-11-28 21:49:28','2024-11-28 21:49:28'),(60,6,1,'in_room','2024-11-28 21:49:28','2024-11-28 21:49:28'),(61,6,1,'in_room','2024-11-28 21:49:29','2024-11-28 21:49:29'),(62,6,1,'in_room','2024-11-28 21:49:29','2024-11-28 21:49:29'),(63,6,1,'in_room','2024-11-28 21:49:29','2024-11-28 21:49:30'),(64,6,1,'in_room','2024-11-28 21:49:30','2024-11-28 21:49:30'),(65,6,1,'in_room','2024-11-28 21:49:30','2024-11-28 21:49:30'),(66,6,1,'in_room','2024-11-28 21:49:31','2024-11-28 21:49:31'),(67,6,1,'in_room','2024-11-28 21:49:31','2024-11-28 21:49:31'),(68,6,1,'in_room','2024-11-28 21:49:31','2024-11-28 21:49:32'),(69,6,1,'in_room','2024-11-28 21:49:32','2024-11-28 21:49:32'),(70,6,1,'in_room','2024-11-28 21:49:32','2024-11-28 21:49:32'),(71,6,1,'in_room','2024-11-28 21:49:33','2024-11-28 21:49:33'),(72,6,1,'in_room','2024-11-28 21:49:33','2024-11-28 21:49:33'),(73,6,1,'in_room','2024-11-28 21:49:33','2024-11-28 21:49:34'),(74,6,1,'in_room','2024-11-28 21:49:34','2024-11-28 21:49:34'),(75,6,1,'in_room','2024-11-28 21:49:34','2024-11-28 21:49:34'),(76,6,1,'in_room','2024-11-28 21:49:35','2024-11-28 21:49:35'),(77,6,1,'in_room','2024-11-28 21:49:35','2024-11-28 21:49:35'),(78,6,1,'in_room','2024-11-28 21:49:35','2024-11-28 21:49:36'),(79,6,1,'in_room','2024-11-28 21:49:36','2024-11-28 21:49:36'),(80,6,1,'in_room','2024-11-28 21:49:36','2024-11-28 21:49:36'),(81,6,1,'in_room','2024-11-28 21:49:37','2024-11-28 21:49:37'),(82,6,1,'in_room','2024-11-28 21:49:37','2024-11-28 21:49:37'),(83,6,1,'in_room','2024-11-28 21:49:37','2024-11-28 21:49:38'),(84,6,1,'in_room','2024-11-28 21:49:38','2024-11-28 21:49:38'),(85,6,1,'in_room','2024-11-28 21:49:38','2024-11-28 21:49:39'),(86,6,1,'in_room','2024-11-28 21:49:39','2024-11-28 21:49:39'),(87,6,1,'in_room','2024-11-28 21:49:39','2024-11-28 21:49:39'),(88,6,1,'in_room','2024-11-28 21:49:39','2024-11-28 21:49:40'),(89,6,1,'in_room','2024-11-28 21:49:40','2024-11-28 21:49:40'),(90,6,1,'in_room','2024-11-28 21:49:40','2024-11-28 21:49:41'),(91,6,1,'in_room','2024-11-28 21:49:41','2024-11-28 21:49:41'),(92,6,1,'in_room','2024-11-28 21:49:41','2024-11-28 21:49:41'),(93,6,1,'in_room','2024-11-28 21:49:42','2024-11-28 21:49:42'),(94,6,1,'in_room','2024-11-28 21:49:42','2024-11-28 21:49:42'),(95,6,1,'in_room','2024-11-28 21:49:42','2024-11-28 21:49:43'),(96,6,1,'in_room','2024-11-28 21:49:43','2024-11-28 21:49:43'),(97,6,1,'in_room','2024-11-28 21:49:43','2024-11-28 21:49:43'),(98,6,1,'in_room','2024-11-28 21:49:44','2024-11-28 21:49:44'),(99,6,1,'in_room','2024-11-28 21:49:44','2024-11-28 21:49:44'),(100,6,1,'in_room','2024-11-28 21:49:44','2024-11-28 21:49:45'),(101,6,1,'in_room','2024-11-28 21:49:45','2024-11-28 21:49:45'),(102,6,1,'in_room','2024-11-28 21:49:45','2024-11-28 21:49:45'),(103,6,1,'out_laundry','2024-11-28 21:49:46',NULL);
/*!40000 ALTER TABLE `washings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 21:52:40
