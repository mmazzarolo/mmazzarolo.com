#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const kebabCase = require("lodash.kebabcase");

const isNumeric = x => !isNaN(parseFloat(x));

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();
const currentDate =
  currentYear +
  "-" +
  (currentMonth < 10 ? "0" : "") +
  currentMonth +
  "-" +
  (currentDay < 10 ? "0" : "") +
  currentDay;

const promptReviewTypeQuestion = async () => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "type",
    message: "What are you planning to create?",
    choices: ["Album review", "Book review", "Movie review", "TV serie review"]
  });
  if (answer.type === "Album review") {
    return "albums";
  } else if (answer.type === "Book review") {
    return "books";
  } else if (answer.type === "Movie review") {
    return "movies";
  } else if (answer.type === "TV serie review") {
    return "tv-series";
  } else {
    throw new Error("Invalid review type:", answer.type);
  }
};

const promptReviewInfoQuestions = async reviewType => {
  const title = {
    name: "title",
    message: "Title:"
  };
  const artist = {
    name: "artist",
    message: "Artist:"
  };
  const director = {
    name: "director",
    message: "Director:"
  };
  const author = {
    name: "author",
    message: "Author"
  };
  const genre = {
    name: "genre",
    message: "Genres (comma separated):"
  };
  const season = {
    name: "season",
    message: "Season:"
  };
  const year = {
    name: "year",
    message: "Year:",
    default: new Date().getFullYear(),
    validate: input => {
      return isNumeric(input) || "Please submit a valid year";
    }
  };
  const score = {
    name: "score",
    message: "Score (1 to 5):",
    validate: input => {
      const isValid =
        isNumeric(input) && Number(input) >= 1 && Number(input) <= 5;
      return isValid || "Please submit a valid score";
    }
  };
  if (reviewType === "albums") {
    return await inquirer.prompt([title, artist, genre, year, score]);
  } else if (reviewType === "books") {
    return await inquirer.prompt([title, author, genre, year, score]);
  } else if (reviewType === "movies") {
    return await inquirer.prompt([title, director, genre, year, score]);
  } else if (reviewType === "tv-series") {
    return await inquirer.prompt([title, director, genre, season, year, score]);
  } else {
    throw new Error("Invalid review type:", reviewType);
  }
};

const buildFrontMatters = (reviewType, reviewInfo) => {
  const delimiter = `---`;
  const date = `date: "${currentDate}"`;
  const categories = `categories: [${reviewType}]`;
  const rest = Object.keys(reviewInfo)
    .map(key => {
      const value = reviewInfo[key];
      if (key === "genre") {
        return `${key}: [${value}]`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .join("\n");
  const frontMatters = [delimiter, date, categories, rest, delimiter].join(
    "\n"
  );
  return frontMatters;
};

const getFilePath = (reviewType, reviewInfo) => {
  const path = `../../content/reviews/${reviewType}`;
  const filename = `${currentDate}-${kebabCase(reviewInfo.title)}`;
  const extension = "md";
  return `${path}/${filename}.${extension}`;
};

const promptForConfirm = async (frontMatters, filePath) => {
  console.log(" === Expected result ===");
  console.log("File path:", filePath);
  console.log("Front Matters:");
  console.log(frontMatters);
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "result",
    message: "Does it look good?"
  });
  return answer.result;
};

const script = async function() {
  const reviewType = await promptReviewTypeQuestion();
  const reviewInfo = await promptReviewInfoQuestions(reviewType);
  const frontMatters = buildFrontMatters(reviewType, reviewInfo);
  const filePath = getFilePath(reviewType, reviewInfo);
  const hasConfirmed = await promptForConfirm(frontMatters, filePath);
  if (hasConfirmed) {
    fs.writeFileSync(filePath, frontMatters);
  }
};

script();
