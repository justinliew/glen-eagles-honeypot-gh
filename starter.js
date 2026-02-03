var gSecret;

var honeypot;

function submit_honeypot() {
  for (let i=0;i<honeypot.players.length;++i) {
    if (honeypot.players[i].gross_score == null) {
      const dialog = document.getElementById("submit_failed");
      dialog.showModal();
      return;
    }
  }
  
  // Check that all KP and longest putt selections are made
  const kpHole5High = document.getElementById('kp_hole5_high').value;
  const kpHole5Low = document.getElementById('kp_hole5_low').value;
  const kpHole8High = document.getElementById('kp_hole8_high').value;
  const kpHole8Low = document.getElementById('kp_hole8_low').value;
  const longestPutt = document.getElementById('longest_putt').value;
  
  if (!kpHole5High || !kpHole5Low || !kpHole8High || !kpHole8Low || !longestPutt) {
    alert("Please select winners for all KP holes and longest putt before submitting.");
    return;
  }
  
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  fetch("https://honeypot.edgecompute.app/submit_honeypot", {
    headers: headers
  })
    .then(response => {
    return response.json();
  })
    .then(response => {
      console.log(response);
      document.getElementById("no_honeypot").style.display = 'none';      
      document.getElementById("has_honeypot").style.display = 'none';
      document.getElementById("show_results").style.display = 'block';

      let table = clear_table('result_table');
      for (let i=0; i < response.length;++i) {
        var row = table.insertRow(table.rows.length);
        let namecell = row.insertCell(0);
        namecell.innerHTML = response[i].name;
        let catcell = row.insertCell(1);
        catcell.innerHTML = response[i].cat;          
        let resultcell = row.insertCell(2);
        resultcell.innerHTML = "$" + response[i].amt.toFixed(2);
      }
    
  });
}

function submit_honeypot_confirm() {
  const dialog = document.getElementById("submit_confirm");
  const cancelButton = document.getElementById("submit_confirm_cancel"); 
  const submitButton = document.getElementById("submit_confirm_submit");
  
  document.getElementById("submit_label").innerHTML = "Submit honeypot results for " + honeypot.players.length + " players?"
  
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    submit_honeypot();
  });

  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });    
}

function new_honeypot() {
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  fetch("https://honeypot.edgecompute.app/new_honeypot", {
    headers: headers
  })
    .then(response => {
      return response.text();
  })
    .then(response => {
      init_player_list();
  });
}

function delete_honeypot() {
  
  const dialog = document.getElementById("delete_confirm");
  const cancelButton = document.getElementById("delete_confirm_cancel"); 
  const submitButton = document.getElementById("delete_confirm_submit");
  
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    const headers = new Headers();
    headers.append("secret",gSecret);
    headers.append("scope","starter");

    fetch("https://honeypot.edgecompute.app/delete_honeypot", {
      headers: headers
    })
      .then(response => {
        return response.text();
    })
      .then(response => {
        init_player_list();
    });
  });

  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });  
}

function add_all_players() {
  const dialog = document.getElementById("add_all_confirm");
  const cancelButton = document.getElementById("add_all_confirm_cancel"); 
  const submitButton = document.getElementById("add_all_confirm_submit");
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    const headers = new Headers();
    headers.append("secret",gSecret);
    headers.append("scope","starter");
    fetch("https://honeypot.edgecompute.app/add_all_players", {
      headers: headers
    })
    .then(response => {
      init_player_list();
    });
  });
  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });  
}

function add_player() {
  const dialog = document.getElementById("add_dialog");
  const cancelButton = document.getElementById("add_dialog_cancel"); 
  const submitButton = document.getElementById("add_dialog_submit");
  
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");
  fetch("https://honeypot.edgecompute.app/get_player_list", {
    headers: headers
  })
    .then(response => {
      return response.json();
  })
    .then(response => {
      const select = document.getElementById('player_select');
      select.innerHTML = "";  
      for (let i=0;i<response.players.length;++i) {
        let option = new Option(response.players[i].name,response.players[i].name);
        select.add(option,undefined);
      }

      dialog.showModal();
      submitButton.addEventListener("click", function l() {
        submitButton.removeEventListener("click", l);
        dialog.close("chosen");
        const headers = new Headers();
        headers.append("player", select.value);
        headers.append("secret",gSecret);
        headers.append("scope","starter");

        fetch("https://honeypot.edgecompute.app/add_player", {
          headers: headers
        })
        .then(response => {
          init_player_list();
        });
      });

      // Form cancel button closes the dialog box
      cancelButton.addEventListener("click", () => {
        dialog.close("notchosen");
      });
  });
}

function clear_table(table_name) {
  let table = document.getElementById(table_name);
  for (var i=table.rows.length-1;i>=1;--i) {
    table.deleteRow(i);
  }
  return table;
}

function init_player_list() {
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  // is there an existing honeypot in progresss?
  fetch("https://honeypot.edgecompute.app/get_honeypot", {
    headers: headers
  })
    .then(response => {
    return response.json();
    })
    .then(players => {
    let count = Object.keys(players).length;
    honeypot = players;
    if (count == 0) {
      document.getElementById("no_honeypot").style.display = 'block';
      document.getElementById("has_honeypot").style.display = 'none';
      document.getElementById("show_results").style.display = 'none';
    } else {
      document.getElementById("no_honeypot").style.display = 'none';      
      document.getElementById("has_honeypot").style.display = 'block';
      document.getElementById("show_results").style.display = 'none';
      let table = clear_table('player_table');
      
      // Populate KP and longest putt dropdowns
      const kpHole5HighSelect = document.getElementById('kp_hole5_high');
      const kpHole5LowSelect = document.getElementById('kp_hole5_low');
      const kpHole8HighSelect = document.getElementById('kp_hole8_high');
      const kpHole8LowSelect = document.getElementById('kp_hole8_low');
      const longestPuttSelect = document.getElementById('longest_putt');
      
      // Clear existing options except the first one
      kpHole5HighSelect.innerHTML = '<option value="">-- Select Player --</option>';
      kpHole5LowSelect.innerHTML = '<option value="">-- Select Player --</option>';
      kpHole8HighSelect.innerHTML = '<option value="">-- Select Player --</option>';
      kpHole8LowSelect.innerHTML = '<option value="">-- Select Player --</option>';
      longestPuttSelect.innerHTML = '<option value="">-- Select Player --</option>';
      
      // Add all players to the dropdowns
      for (let i=0; i < players.players.length;++i) {
        let option1 = new Option(players.players[i].name, players.players[i].name);
        let option2 = new Option(players.players[i].name, players.players[i].name);
        let option3 = new Option(players.players[i].name, players.players[i].name);
        let option4 = new Option(players.players[i].name, players.players[i].name);
        let option5 = new Option(players.players[i].name, players.players[i].name);
        kpHole5HighSelect.add(option1);
        kpHole5LowSelect.add(option2);
        kpHole8HighSelect.add(option3);
        kpHole8LowSelect.add(option4);
        longestPuttSelect.add(option5);
      }
      
      // Restore saved selections from server
      if (players.kp_hole5_high) kpHole5HighSelect.value = players.kp_hole5_high;
      if (players.kp_hole5_low) kpHole5LowSelect.value = players.kp_hole5_low;
      if (players.kp_hole8_high) kpHole8HighSelect.value = players.kp_hole8_high;
      if (players.kp_hole8_low) kpHole8LowSelect.value = players.kp_hole8_low;
      if (players.long) longestPuttSelect.value = players.long;
      
      // Add event listeners to save selections to server when changed
      kpHole5HighSelect.addEventListener('change', () => {
        const headers = new Headers();
        headers.append("player", kpHole5HighSelect.value);
        headers.append("is_low", "false");
        headers.append("secret", gSecret);
        headers.append("scope", "starter");
        fetch("https://honeypot.edgecompute.app/set_kp_hole5", {
          headers: headers
        });
      });
      
      kpHole5LowSelect.addEventListener('change', () => {
        const headers = new Headers();
        headers.append("player", kpHole5LowSelect.value);
        headers.append("is_low", "true");
        headers.append("secret", gSecret);
        headers.append("scope", "starter");
        fetch("https://honeypot.edgecompute.app/set_kp_hole5", {
          headers: headers
        });
      });
      
      kpHole8HighSelect.addEventListener('change', () => {
        const headers = new Headers();
        headers.append("player", kpHole8HighSelect.value);
        headers.append("is_low", "false");
        headers.append("secret", gSecret);
        headers.append("scope", "starter");
        fetch("https://honeypot.edgecompute.app/set_kp_hole8", {
          headers: headers
        });
      });
      
      kpHole8LowSelect.addEventListener('change', () => {
        const headers = new Headers();
        headers.append("player", kpHole8LowSelect.value);
        headers.append("is_low", "true");
        headers.append("secret", gSecret);
        headers.append("scope", "starter");
        fetch("https://honeypot.edgecompute.app/set_kp_hole8", {
          headers: headers
        });
      });
      
      longestPuttSelect.addEventListener('change', () => {
        const headers = new Headers();
        headers.append("player", longestPuttSelect.value);
        headers.append("secret", gSecret);
        headers.append("scope", "starter");
        fetch("https://honeypot.edgecompute.app/set_longest_putt", {
          headers: headers
        });
      });
      
      for (let i=0; i < players.players.length;++i) {
        var row = table.insertRow(table.rows.length);
        let namecell = row.insertCell(0);
        namecell.innerHTML = players.players[i].name;

        let delcell = row.insertCell(1);
        var btn = document.createElement('input');
        btn.type = "button";        
        btn.value = "Remove";
        btn.onclick = function(){
        const headers = new Headers();
          headers.append("player", players.players[i].name);
          headers.append("secret", gSecret);
          headers.append("scope","starter");
          fetch("https://honeypot.edgecompute.app/delete_player", {
            headers: headers
          })
          .then(response => {
            init_player_list();
          });
        };
        delcell.appendChild(btn);
        
        let gscorecell = row.insertCell(2);
        var gscoreinput = document.createElement("input");
        gscoreinput.size = 2;
        gscoreinput.onchange = (event) => {
          let score = event.target.value;
          let player = players.players[i].name;
          let headers = new Headers();
          headers.append("score", score);
          headers.append("player", player);
          headers.append("secret", gSecret);
          headers.append("scope","starter");
          fetch("https://honeypot.edgecompute.app/add_score", {
            headers: headers
          })
          .then(response => {
            return response.text();
          })
          .then(response => {
            console.log(response);
            init_player_list();
          });
        };
        let nscorecell = row.insertCell(3);
        var nscoreinput = document.createElement("input");
        nscoreinput.size = 3;
        nscoreinput.setAttribute('readonly', true);
        if (players.players[i].net_score != null) {
          nscoreinput.value = players.players[i].net_score;
        } else {
          nscoreinput.value = 0;
        }
        nscorecell.appendChild(nscoreinput);
        if (players.players[i].gross_score != null) {
          gscoreinput.value = players.players[i].gross_score;
        } else {
          gscoreinput.value = 0;
        }
        gscorecell.appendChild(gscoreinput);
      }
    }
  });  
}

function cache_query_param() {
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope", "starter");
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
