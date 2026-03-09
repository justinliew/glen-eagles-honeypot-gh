var gSecret;

// All winnings data, grouped by player
var playerWinnings = {};

function clear_table(table_name) {
  let table = document.getElementById(table_name);
  for (var i = table.rows.length - 1; i >= 1; --i) {
    table.deleteRow(i);
  }
  return table;
}

function showLoading() {
  document.getElementById("loading").style.display = 'block';
  document.getElementById("player_list").style.display = 'none';
  document.getElementById("player_detail").style.display = 'none';
}

function showPlayerList() {
  document.getElementById("loading").style.display = 'none';
  document.getElementById("player_list").style.display = 'block';
  document.getElementById("player_detail").style.display = 'none';
}

function showPlayerDetail() {
  document.getElementById("loading").style.display = 'none';
  document.getElementById("player_list").style.display = 'none';
  document.getElementById("player_detail").style.display = 'block';
}

function processWinningsData(winnings) {
  // Group winnings by player name
  playerWinnings = {};
  
  for (let i = 0; i < winnings.length; ++i) {
    const entry = winnings[i];
    const playerName = entry.name;
    
    if (!playerWinnings[playerName]) {
      playerWinnings[playerName] = {
        name: playerName,
        history: [],
        totalWinnings: 0
      };
    }
    
    playerWinnings[playerName].history.push({
      date: entry.date,
      category: entry.cat,
      amount: entry.amt
    });
    playerWinnings[playerName].totalWinnings += entry.amt;
  }
  
  // Convert to array and sort by total winnings (highest first)
  let playersArray = Object.values(playerWinnings);
  playersArray.sort((a, b) => b.totalWinnings - a.totalWinnings);
  
  return playersArray;
}

function displayPlayerList(players) {
  let table = clear_table('winnings_table');
  
  for (let i = 0; i < players.length; ++i) {
    var row = table.insertRow(table.rows.length);
    
    // Player name cell (clickable)
    let nameCell = row.insertCell(0);
    var btn = document.createElement('input');
    btn.type = "button";
    btn.value = players[i].name;
    btn.className = "player-btn";
    btn.onclick = (function(player) {
      return function() {
        displayPlayerDetail(player);
      };
    })(players[i]);
    nameCell.appendChild(btn);
    
    // Total winnings cell
    let totalCell = row.insertCell(1);
    totalCell.innerHTML = "$" + players[i].totalWinnings.toFixed(2);
  }
  
  showPlayerList();
}

function displayPlayerDetail(player) {
  // Set player name and total
  document.getElementById("player_name").innerHTML = player.name;
  document.getElementById("player_total").innerHTML = "$" + player.totalWinnings.toFixed(2);
  
  // Populate history table
  let table = clear_table('history_table');
  
  for (let i = 0; i < player.history.length; ++i) {
    var row = table.insertRow(table.rows.length);
    
    let dateCell = row.insertCell(0);
    var localDate = new Date(player.history[i].date);
    dateCell.innerHTML = localDate.toDateString();
    
    let catCell = row.insertCell(1);
    catCell.innerHTML = player.history[i].category;
    
    let amtCell = row.insertCell(2);
    amtCell.innerHTML = "$" + player.history[i].amount.toFixed(2);
  }
  
  showPlayerDetail();
}

function fetchWinningsData() {
  const headers = new Headers();
  headers.append("secret", gSecret);
    headers.append("scope", "starter");

  fetch("https://honeypot.edgecompute.app/get_all_winnings", {
    headers: headers
  })
  .then(response => {
    return response.json();
  })
  .then(winnings => {
    // winnings is an array of { cat: string, name: string, amt: number }
    let players = processWinningsData(winnings);
    displayPlayerList(players);
  })
  .catch(error => {
    console.error("Error fetching winnings:", error);
    document.getElementById("loading").innerHTML = "Error loading winnings data.";
  });
}

function cache_query_param() {
  showLoading();
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret", gSecret);
  headers.append("scope", "starter");
  fetch("https://honeypot.edgecompute.app/verify", {
    headers: headers
  })
  .then(response => {
    if (response.status == 200) {
      fetchWinningsData();
    } else {
      document.getElementById("loading").innerHTML = "Not authorized.";
    }
  });
}

cache_query_param();
