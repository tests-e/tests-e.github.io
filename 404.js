let urlPathname = window.location.pathname;
let pg_NAME = urlPathname.split('/').filter(Boolean)[0]
console.log(pg_NAME)

let pg_DATA;
let pg_CONTENT;




/* let data = {
    "settings": {
        "email": "hello.grumpytable@gmail.com",
        "token": "1234abcd"
    },
    "content": {
        "title": "I'm Nikola. I invent the future.",
        "description": "Visionary engineer, physicist, and inventor—my work lights the world, powers its machines, and defies the impossible.\n\nFrom the thunderous pulse of alternating current to the silent hum of wireless power, I strive not merely to improve humanity’s tools—but to uplift its spirit.",
        "links": [
            {
                "title": "The Tesla Coil",
                "description": "A gateway to wireless energy transmission and high-voltage experimentation.",
                "uri": "https://pinterest.com"
            },
            {
                "title": "Remote-Controlled Boat (1898)",
                "description": "The dawn of robotics—a wireless vessel controlled by unseen waves.",
                "uri": "https://pinterest.com"
            }
        ]
    }
};
pg_CONTENT = data.content
renderPage() */






fetch(`https://broad-cherry-4d3b.instproasmith.workers.dev/get?key=${pg_NAME}`)
  .then(res => {
    if (res.status === 200) {
      return res.json();
    }else if(res.status === 400){
      throw new Error("Missing 'page name'")
    }else if(res.status === 404){
      throw new Error("Page Not Found")
    }
  })
  .then(data => {
    console.log("Fetched JSON:", data);
    pg_CONTENT = data //pura data mat lao token chori ho jayega
    renderPage()
  })
  .catch(error =>{
    console.error(error)
    console.error(error.message)
    //alert(error.message)
  })




  function renderPage(){
    document.getElementById('title').textContent = pg_CONTENT.title;
    document.getElementById('description').textContent = pg_CONTENT.description;

    renderLinks()
  }

function renderLinks() {
    document.getElementById('links_container').innerHTML = "";
    pg_CONTENT.links.forEach(link => {
            console.log(link)
            let div = document.createElement('div');
            let img = document.createElement('img');//
            let title = document.createElement('p');
            let description = document.createElement('p');

            div.className= "link-div";
            img.className= "link-img";//
            title.className= "link-title";
            description.className= "link-description";

           div.setAttribute("onclick",`window.location.href="${link.uri}"`)

            //div.onclick= () => `window.location.href="${link.uri}`;

            title.innerHTML = link.title + ' <i class="hgi hgi-stroke hgi-link-square-01"></i>';
            description.textContent = link.description;
            img.src = link.img

            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(description);
            document.getElementById('links_container').appendChild(div)
            
    }); 
}




/*
 if (token_from_url !== "" && token_from_url !== null && token_from_url !== undefined){
    let editorScript = document.createElement('script');
    editorScript.src = "/editor.js"
    document.body.appendChild(editorScript);

    
 }
*/
//data-uri ="4"
//div.dataset.uri = "8ids"