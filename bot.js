const bot = "resyfer's CPBot";

/* Require packages */

/* ENV Variables */
require('dotenv').config();
const token = process.env.DISCORD_BOT_TOKEN;

const fs = require('fs');
const axios = require('axios');

  /* Discord API */
const Discord = require('discord.js');
const client = new Discord.Client({
  presence : {
    status : 'online',
    activity : {
      name : '&help',
      type: 'LISTENING'
    }
  }
}); //Creating client instance

/* Constants */
const codeforces = `https://codeforces.com/api/`; /* Codeforces API Base URL */

const botActivate = '&'; /* Bot Activation command */

let botId;

  /* List of Commands */
const commands = [
  'help',
  'my-handle',
  'standings',
  'all-standings',
  'contest-ranklist',
  //'ranklist',
  'first-to-solve',
];

/* Client Up and Running */
client.on('ready', ()=> {
  console.log("Bot is running!");
  botId = client.user.id;
});

/* Parse the Codeforces handles for the Discord IDs */
//let handles = JSON.parse(fs.readFileSync('./data.json'));

/* Possible commands */
client.on('message', msg => {
       if (msg.content.substring(0,botActivate.length + commands[0].length) == `${botActivate}${commands[0]}`) viewCommands(msg);
  else if (msg.content.substring(0,botActivate.length + commands[1].length) == `${botActivate}${commands[1]}`) addHandleJSON(msg);
  else if (msg.content.substring(0,botActivate.length + commands[2].length) == `${botActivate}${commands[2]}`) viewMyStanding(msg);
  else if (msg.content.substring(0,botActivate.length + commands[3].length) == `${botActivate}${commands[3]}`) viewContestStanding(msg);
  // else if (msg.content.substring(0,botActivate.length + commands[4].length) == `${botActivate}${commands[4]}`) contestRanklist(msg);
  // else if (msg.content.substring(0,botActivate.length + commands[5].length) == `${botActivate}${commands[5]}`) ranklist(msg);
  // else if (msg.content.substring(0,botActivate.length + commands[6].length) == `${botActivate}${commands[6]}`) firstToSolveContest(msg);
  else if(msg.content.substring(0,botActivate.length) == botActivate) msg.channel.send(`<@${msg.author.id}> Use \`&help\` for all the commands`);
});

function viewCommands(msg) {
  if(msg.author.id == botId) return;

  msg.channel.send(`
<@${msg.author.id}>
 :point_right: \`${botActivate}${commands[1]} YOUR_CODEFORCES_HANDLE\` - Add/Update/View Codeforces handle details

 :point_right: \`${botActivate}${commands[2]} CONTEST_CODE YOUR_CODEFORCES_HANDLE\` - View your standing in a particular contest. Get the contest code using URL like:  \`https://codeforces.com/contest/CONTEST_CODE\` 

 :point_right: \`${botActivate}${commands[3]} CONTEST_CODE\` - View all members' standings in a particular contest. Get the contest code using URL like:  \`https://codeforces.com/contest/CONTEST_CODE\`
`); 
//  :point_right: \`${botActivate}${commands[4]} CONTEST_CODE\` - View ranklist of all members in a particular contest. Get the contest code using URL like:  \`https://codeforces.com/contest/CONTEST_CODE\`
 
//  :point_right: \`${botActivate}${commands[5]}\` - View ranklist of all members based on their current rating.

//  :point_right: \`${botActivate}${commands[6]} CONTEST_CODE QUESTION_CODE\` - View first to solve a particular problem in a particular contest. Get the codes using URL like:  \`https://codeforces.com/contest/CONTEST_CODE/problem/QUESTION_CODE\`
//   `);
}

async function addHandleJSON(msg) {

  if(msg.author.id == botId) return;

  let textArray = msg.content.split(" ");
  let codeforcesHandle = textArray[textArray.length - 1];
  
  let discordAuthorId = msg.author.id;

  let codeforcesAPILink = codeforces + "user.info?handles=" + codeforcesHandle;

  /* HTTPS Get Request to Codeforces API */
  let codeforcesGet = await getURLAsync(codeforcesAPILink, msg);
  if(!codeforcesGet) return; /* Stops for errors in retrieval */

  let codeforcesFullName = `${codeforcesGet.data.result[0].firstName}` + " " + `${codeforcesGet.data.result[0].lastName}`;
  let codeforcesRank = codeforcesGet.data.result[0].rank;
  let codeforcesMaxRank = codeforcesGet.data.result[0].maxRank;
  let codeforcesRating = codeforcesGet.data.result[0].rating;
  let codeforcesMaxRating = codeforcesGet.data.result[0].maxRating;
  let codeforcesProfilePic = codeforcesGet.data.result[0].titlePhoto;

  msg.channel.send(`
<@${msg.author.id}>
\`\`\`yaml
Codeforces Handle: ${codeforcesHandle} (${codeforcesFullName})

Codeforces Rank: ${codeforcesRank}
Codeforces Max Rank: ${codeforcesMaxRank}
Codeforces Rating: ${codeforcesRating}
Codeforces Max Rating: ${codeforcesMaxRating}
\`\`\`
${codeforcesProfilePic}
  `);

  let jsonData = JSON.parse(fs.readFileSync('./data.json', (err)=> {
    msg.channel.send("There was an error, please try again.");
    return;
  }));

  //Add check to remove old handle for updates.
  jsonData[codeforcesHandle] = discordAuthorId;

  fs.writeFileSync('./data.json', JSON.stringify(jsonData, null, 2));
}

async function viewMyStanding(msg) {

  let textArray = msg.content.split(" ");
  let codeforcesHandle = textArray[textArray.length - 1];
  let codeforcesContestCode = textArray[textArray.length - 2];

  let codeforcesAPILink = codeforces + "contest.standings?contestId=" + codeforcesContestCode + "&handles=" + codeforcesHandle;

  /* HTTPS Get Request to Codeforces API */
  let codeforcesGet = await getURLAsync(codeforcesAPILink, msg);
  if(!codeforcesGet) return; /* Stops for errors in retrieval */

  if(codeforcesGet.data.status != "OK") {
    msg.channel.send('Wrong contest code, please try again');
    return;
  }

  //CONTESTANT OR TEAM add logic 

  let contestName = codeforcesGet.data.result.contest.name;
  let contestRank = codeforcesGet.data.result.rows[0].rank;
  let penalty = codeforcesGet.data.result.rows[0].penalty;
  let points = codeforcesGet.data.result.rows[0].points;


  let message = `
<@${msg.author.id}>
\`\`\`yaml
Contest Name : ${contestName}
Contest Rank : ${contestRank}
Penalty : ${penalty}
Points : ${points}

Problems Solved:
\`\`\`
  `;

  for(let i = 0; i<codeforcesGet.data.result.problems.length; i++) {
    if(codeforcesGet.data.result.rows[0].problemResults[i].points) {
      message += `
\`${codeforcesGet.data.result.problems[i].index}\` : :white_check_mark:
      `;
    } else {
      message += `
\`${codeforcesGet.data.result.problems[i].index}\` : :x:
      `;
    }
  }
  
  msg.channel.send(message);
}

async function viewContestStanding(msg) {

  let textArray = msg.content.split(" ");
  let codeforcesContestCode = textArray[textArray.length - 1];

  let codeforcesAPILink = codeforces + "contest.standings?contestId=" + codeforcesContestCode;
  
  let codeforcesGet = await getURLAsync(codeforcesAPILink, msg);
  if(!codeforcesGet) return;

  let contestName = codeforcesGet.data.result.contest.name;

  let jsonData = JSON.parse(fs.readFileSync('./data.json', (err)=> {
    msg.channel.send("There was an error, please try again.");
    return;
  }));

  let participants = codeforcesGet.data.result.rows.length;

  let contestRanklist = [];
  for(let i = 0; i<=participants; i++) {
    let membersNumber = codeforcesGet.data.result.rows[i].party.members.length;
    let membersList = [];
    for(let j = 0; j<membersNumber; j++) {
      let handle = codeforcesGet.data.result.rows[i].party.members[j].handle;
      if(jsonData[handle]) membersList.push(handle);
    }
    if(membersList.length > 0) contestRanklist.push([i+1, membersList.join(", ")]);
  }

  message = ``;
  for(let i = 0; i<contestRanklist.length; i++) {
    message += `
    ${contestRanklist[i][0].toString().padStart(4, " ")}\t${contestRanklist[i][1]}`;
  }

  msg.channel.send(`
<@${msg.author.id}>
\`\`\`yaml
Contest Name: ${contestName0}

Ranklist:
${message}
\`\`\`
  `)
}

async function getURLAsync(url, msg) {
  let myPromise = new Promise((resolve, reject) => {
    resolve(axios.get(url).catch((err) => {
      msg.channel.send(`<@${msg.author.id}> Wrong handle, please try again!`);
      return false;
    }));
  });
  return await myPromise;
}

client.login(token);