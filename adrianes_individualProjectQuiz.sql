-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 24, 2021 at 06:49 PM
-- Server version: 10.3.28-MariaDB-log
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adrianes_individualProjectQuiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `Answers`
--

CREATE TABLE `Answers` (
  `AnswerID` int(11) NOT NULL,
  `QuestionID` int(11) DEFAULT NULL,
  `AnswerText` varchar(255) DEFAULT NULL,
  `Correct` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Answers`
--

INSERT INTO `Answers` (`AnswerID`, `QuestionID`, `AnswerText`, `Correct`) VALUES
(232, 82, 'a', 0),
(233, 82, 'b', 1),
(234, 82, 'Not enough information', 0),
(235, 83, 'John', 1),
(236, 83, 'Smith', 0),
(237, 83, 'Supercoder', 0),
(238, 83, 'Anonymous', 0),
(242, 84, '3', 0),
(243, 84, '2', 0),
(244, 84, 'Syntax error', 1),
(245, 84, 'Not enough information', 0),
(246, 85, 'let sum = (a, b) => a + b;', 1),
(247, 85, 'let sum = (a, b) <= a + b;', 0),
(248, 85, 'let sum = (a, b) == a + b;', 0),
(249, 85, 'let sum = (a, b) != a + b;', 0),
(250, 86, 'continue;', 0),
(251, 86, 'break;', 0),
(252, 86, 'return result;', 1),
(253, 86, 'This function runs properly the way it is', 0),
(256, 87, 'Hello', 0),
(257, 87, 'Greetings!', 1),
(258, 87, 'Not enough information', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Questions`
--

CREATE TABLE `Questions` (
  `QuestionID` int(11) NOT NULL,
  `QuestionText` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Questions`
--

INSERT INTO `Questions` (`QuestionID`, `QuestionText`) VALUES
(82, 'If a is not defined, then what is the result of a ?? b'),
(83, 'What would be the output of this script?\nlet firstName = \"John\";\nlet lastName = \"Smith\";\nlet nickName = \"Supercoder\";\nconsole.log(firstName ?? lastName ?? nickName ?? \"Anonymous\");'),
(84, 'What would be the output of this script?\nlet x = 1 && 2 ?? 3;\nconsole.log(x);'),
(85, 'How would the following script be written as an arrow function?\nlet sum = function(a, b) {\n   return a + b;\n};'),
(86, 'What line of code is missing in the following script, that would make this function run properly (line 3)?\nlet sum = (a, b) => {\n    let result = a + b;\n    // missing line\n};'),
(87, 'What would be the output of this script?\nlet age = 18;\nlet welcome = (age < 18) ?\n    () => alert(\'Hello\') :\n    () => alert(\"Greetings!\");\nwelcome();');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Answers`
--
ALTER TABLE `Answers`
  ADD PRIMARY KEY (`AnswerID`),
  ADD KEY `QuestionID` (`QuestionID`);

--
-- Indexes for table `Questions`
--
ALTER TABLE `Questions`
  ADD PRIMARY KEY (`QuestionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Answers`
--
ALTER TABLE `Answers`
  MODIFY `AnswerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- AUTO_INCREMENT for table `Questions`
--
ALTER TABLE `Questions`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Answers`
--
ALTER TABLE `Answers`
  ADD CONSTRAINT `Answers_ibfk_1` FOREIGN KEY (`QuestionID`) REFERENCES `Questions` (`QuestionID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
