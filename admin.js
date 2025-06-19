function roll_starter_password() {
  const dialog = document.getElementById("roll_starter_dialog");
  const cancelButton = document.getElementById("roll_starter_cancel"); 
  const submitButton = document.getElementById("roll_starter_submit");
  
    dialog.showModal();
    submitButton.addEventListener("click", function l() {
      submitButton.removeEventListener("click", l);
      dialog.close("chosen");
      const headers = new Headers();
      headers.append("secret",gSecret);
      headers.append("scope","admin");

      fetch("https://honeypot.edgecompute.app/roll", {
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

const player_upload = document.getElementById("player_upload");
player_upload.addEventListener("change", () => {
  for (const file of player_upload.files) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      const headers = new Headers();
      headers.append("secret",gSecret);
      headers.append("scope","admin");      
      fetch("https://honeypot.edgecompute.app/update_handicaps", {
        method: "POST",
        headers: headers,
        body: reader.result
      })
        .then(response => {
          return response.text();
      })
        .then(response => {
          const dialog = document.getElementById("handicap_result");
          const label = document.getElementById("handicap_result_label");
          label.innerHTML = response;
          dialog.showModal();
      });
    };
  }
});


function cache_query_param() {
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope", "admin");
  fetch("https://honeypot.edgecompute.app/verify", {
    headers: headers
  })
  .then(response => {
    if (response.status == 200) {
      // 
    }
  });
}

cache_query_param();
