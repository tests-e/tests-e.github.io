let token_from_url = new URLSearchParams(window.location.search).get("token");
let pg_NAME = new URLSearchParams(window.location.search).get("u");

checkToken_getData()


function checkToken_getData(){

    
    fetch(`https://broad-cherry-4d3b.instproasmith.workers.dev/checkToken-getData?key=${pg_NAME}&token=${token_from_url}`)
  .then(res => {
    if (res.status === 200) {
      return res.json();
    }else if(res.status === 400){
      throw new Error("Missing 'page name' or 'token'")
    }else if(res.status === 403){
      throw new Error("Wrong Token")
    }else if(res.status === 404){
      throw new Error("Page Not Found")
    }
    
  })
  .then(data => {
    // Everythings right


    console.log("Fetched JSON:", data);
    pg_DATA = data;
    pg_CONTENT = data.content 
    buildEditor()
  })
  .catch(error =>{
    console.error(error.message)
    alert(error.message)
  });
 
//CHECKS IF TOKEN IS WRITE AND GETS FULL DATA, ASSIGNS PG_DATA AS WELL; 

/* 



pg_DATA = data;
pg_CONTENT = data.content
buildEditor() */

}



const title = document.getElementById("title");
const description = document.getElementById("description");
const linksContainer = document.getElementById('links_container');

  title.addEventListener("input", () => {
    pg_DATA.content.title = title.innerText.trim();
  });

  description.addEventListener("input", () => {
    pg_DATA.content.description = description.innerText.trim();
  });




function buildEditor() {

  title.textContent = pg_DATA.content.title;
  description.textContent = pg_DATA.content.description;

    document.getElementById('title').contentEditable = true;
    document.getElementById('description').contentEditable = true;
    renderEditableLinks()

    let addLinkBtn = document.createElement('button');
    addLinkBtn.innerHTML = `<i style='font-size:18px;' class="hgi hgi-stroke hgi-plus-sign-square"></i> Add Link`
    addLinkBtn.setAttribute("onclick","addLink()")
    addLinkBtn.className = 'addLinkBtn';
    document.getElementById('page-content').appendChild(addLinkBtn)


    let publishBtn_previewBtn_Div = document.createElement('div');
    publishBtn_previewBtn_Div.className = 'publishBtn_previewBtn_Div'
    publishBtn_previewBtn_Div.innerHTML =`
    <button onclick='preview()' class='previewBtn'><i style='font-size:18px;' class="hgi hgi-stroke hgi-view "></i>Preview</button>
    <button id="publishBtn" onclick='publish()' class='publishBtn'><i id="publishBtnI" style='font-size:18px;' class="hgi hgi-stroke hgi-sent "></i>Publish</button>
    <input type="file" id="fileInput" accept=".gif, .jpg, .jpeg, .png" hidden />
    `

    document.getElementById('container').appendChild(publishBtn_previewBtn_Div)


    // TO FOCUS ON TITLE CONTENTEDITABLE
    const range = document.createRange();
  range.selectNodeContents(document.getElementById('title'));
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

}




function renderEditableLinks() {
    document.getElementById('links_container').innerHTML = "";
    pg_CONTENT.links.forEach((link, index) => {
            //console.log(link)
            let div = document.createElement('div');
            let img = document.createElement('img');//
            let title = document.createElement('p');
            let description = document.createElement('p');

            div.className= "link-div";
            img.className= "link-img";//
            title.className= "link-title";
            description.className= "link-description";

            img.src = link.img
            title.textContent = link.title ;
            description.textContent = link.description;


            title.contentEditable = true;
            description.contentEditable = true;

            title.setAttribute("oninput",`editLink(${index}, 'title', this.innerText.trim())`)
            description.setAttribute("oninput",`editLink(${index}, 'description', this.innerText.trim())`)

            
            let editorLinkBtnsDiv = document.createElement('div')

            editorLinkBtnsDiv.innerHTML = `
            <button class="editorLinkBtns uri-btn" onclick="editUri(${index})"><i class="hgi hgi-stroke hgi-link-02"></i></button>
            <button class="editorLinkBtns" onclick="editImg(${index})"><i class="hgi hgi-stroke hgi-image-02"></i></button>
          <button class="editorLinkBtns up-btn" onclick="moveLink(${index}, -1)"><i class="hgi hgi-stroke hgi-sharp hgi-arrow-up-01"></i></button>
          <button class="editorLinkBtns down-btn" onclick="moveLink(${index}, 1)"><i class="hgi hgi-stroke hgi-sharp hgi-arrow-down-01"></i></button>
          <button class="editorLinkBtns delete-btn" onclick="deleteLink(${index})"><i class="hgi hgi-stroke hgi-delete-02"></i></button>
          <input type="file" id="id${index}" accept=".gif, .jpg, .jpeg, .png" hidden />          
          `
//✏️ Edit URI
// ⬆️ Up
// ⬇️ Down
//🗑️ Delete
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(description);
            div.appendChild(editorLinkBtnsDiv)
            document.getElementById('links_container').appendChild(div)
            
    }); 
}


function editLink(index, key, value) {
    pg_DATA.content.links[index][key] = value;
  }


  function editUri(index) {
    const current = pg_DATA.content.links[index].uri;
    const newUri = prompt("Enter new URL:", current);
    if (newUri !== null) {
        pg_DATA.content.links[index].uri = newUri.trim();
      renderEditableLinks();
    }
  }


  function moveLink(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pg_DATA.content.links.length) return;
    const temp = pg_DATA.content.links[index];
    pg_DATA.content.links[index] = pg_DATA.content.links[newIndex];
    pg_DATA.content.links[newIndex] = temp;
    renderEditableLinks();
  }


  function deleteLink(index) {
    pg_DATA.content.links.splice(index, 1);
    renderEditableLinks();
  }

  function addLink() {
    pg_DATA.content.links.push({ title: 'Title', description: 'Description', img:`data:image/png;base64,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`, uri: 'https://same.new' });
    renderEditableLinks();
  }

  function editImg(index) {
    const fileInput = document.getElementById(`id${index}`);
    fileInput.click()
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
  
      // Check file type
      const allowedTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only GIF, JPG, JPEG, and PNG files are allowed.');
        return;
      }
  
      // Check file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
  
      // Read file as base64
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64DataUrl = event.target.result;
        pg_DATA.content.links[index].img = base64DataUrl;
      renderEditableLinks();
        console.log('Image saved');
      };
  
      reader.readAsDataURL(file);
    });
    
  }

  function publish() {
    //alert('Published')

    /* confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      }); */
      document.getElementById('publishBtn').disabled = true
    
      document.getElementById('publishBtnI').classList.remove('hgi-sent')
      document.getElementById('publishBtnI').classList.add('hgi-loading-02','spinner')

   fetch(`https://broad-cherry-4d3b.instproasmith.workers.dev/store?key=${pg_NAME}&token=${token_from_url}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    key: pg_NAME,
    value: pg_DATA
  })
})
.then((res) => {

  if (res.status === 200) {
    console.log(res)
    return res.text();
  }else if(res.status === 400){
    throw new Error("Invalid JSON or missing fields")
  }



}).then( data => {
  console.log('Published')
document.getElementById('publishBtn').disabled = false
  confetti({
    particleCount: 250,
    spread: 100,
    origin: { y: 0.6 }
  });
})
.catch(error => {
  console.error(error.message)
  alert(error.message)
})
.finally(()=>{
  document.getElementById('publishBtnI').classList.remove('hgi-loading-02','spinner')
      document.getElementById('publishBtnI').classList.add('hgi-sent')
})

  }


  function preview() {
    let previewURL = window.location.protocol + '//' + window.location.host + window.location.pathname
    window.open(previewURL)
  }

// console.log(pg_DATA.content)