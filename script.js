var gSecret;

function score_change() {
  // TODO show net score
}

function has_valid_score(scoreid) {
  let score = document.getElementById(scoreid).value;
  if (score != null && score != 0) {
    return true;
  }
  return false;
}

function submit() {

  if (has_valid_score('score1')) {
    const headers = new Headers();
    let score1 = document.getElementById("score1").value;
    let player1 = document.getElementById("player_list1").value;
    headers.append("score1", score1);
    headers.append("player1", player1);
    headers.append("secret", gSecret);
    headers.append("scope","captain");
    if (has_valid_score('score2')) {
      let score2 = document.getElementById("score2").value;
      let player2 = document.getElementById("player_list2").value;
      headers.append("player2", player2);
      headers.append("score2", score2);
    }
    if (has_valid_score('score3')) {
      let score3 = document.getElementById("score3").value;
      let player3 = document.getElementById("player_list3").value;
      headers.append("player3", player3);
      headers.append("score3", score3);
    }
    if (has_valid_score('score4')) {
      let score4 = document.getElementById("score4").value;
      let player4 = document.getElementById("player_list4").value;
      headers.append("player4", player4);
      headers.append("score4", score4);
    }
    
    fetch("https://honeypot.edgecompute.app/add_scores", {
      headers: headers
    })
      .then(response => {
        document.getElementById("no_honeypot").style.display = 'none';
        document.getElementById("has_honeypot").style.display = 'none';
        document.getElementById("post_submit").style.display = 'block';
      });
  }
}

function init_player_entry(players, name, score) {
  const select = document.getElementById(name);
  select.innerHTML = "";
  for (let i=0;i<players.players.length;++i) {
    let option = new Option(players.players[i].name,players.players[i].name);
    select.add(option,undefined);        
  }       
  document.getElementById(score).value = null;
}

function init_player_list() {
  const headers = new Headers();
  headers.append("secret", gSecret);
  headers.append("scope","captain");

  // is there an existing honeypot in progresss?
  fetch("https://honeypot.edgecompute.app/get_honeypot", {
    headers: headers
  })
    .then(response => {
    return response.json();
    })
    .then(players => {
    let count = Object.keys(players).length;
    if (count == 0) {
      document.getElementById("no_honeypot").style.display = 'block';
      document.getElementById("has_honeypot").style.display = 'none';
      document.getElementById("post_submit").style.display = 'none';
    } else {
      document.getElementById("no_honeypot").style.display = 'none';      
      document.getElementById("has_honeypot").style.display = 'block';
      document.getElementById("post_submit").style.display = 'none';
            
      init_player_entry(players, 'player_list1','score1');
      init_player_entry(players, 'player_list2','score2');
      init_player_entry(players, 'player_list3','score3');
      init_player_entry(players, 'player_list4','score4');
    }
  });
  

  // 
  
  // if so get the info and show it in the table
  
}

function cache_query_param() {
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","captain");
  fetch("https://honeypot.edgecompute.app/verify", {
    headers: headers
  })
  .then(response => {
    if (response.status == 200) {
      init_player_list();      
    }
  });
}

cache_query_param();