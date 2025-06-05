var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var bookmarkForm = document.getElementById("bookmarkForm");
var bookmarkList = document.getElementById("bookmarkList");
var search = document.getElementById("search");

var messageName = document.getElementById("messageName");
var messageUrl = document.getElementById("messageUrl");

var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
displayBookmarks();

bookmarkForm.addEventListener("submit", function (e) {
  e.preventDefault();

if (siteName.value === "" || siteUrl.value === "") {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    html: `
      <p><strong>SiteName:</strong> You should enter the first character capitalized, followed by 2–9 lowercase letters.</p>
      <p><strong>SiteUrl:</strong> Please enter a valid URL starting with http:// or https://, e.g., https://www.example.com</p>
    `
  });
}


  if (validateForm(siteName) && validateForm(siteUrl)) {
    const bookmark = {
      name: siteName.value.trim(),
      url: siteUrl.value.trim(),
    };

    bookmarks.push(bookmark);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    displayBookmarks();
    clearForm();
  }
});

function clearForm() {
  siteName.value = "";
  siteUrl.value = "";

  siteName.classList.remove("is-valid", "is-invalid");
  siteUrl.classList.remove("is-valid", "is-invalid");

  messageName.classList.add("d-none");
  messageUrl.classList.add("d-none");
}

function displayBookmarks() {
  let cartona = "";
  for (let i = 0; i < bookmarks.length; i++) {
    cartona += `
      <tr>
        <td>${i + 1}</td>
        <td>${bookmarks[i].name}</td>
        <td><a href="${
          bookmarks[i].url
        }" target="_blank" class="btn btn-success"><i class="fas fa-eye pe-1"></i>Visit</a></td>
        <td><button onclick="deleteBookmark(${i})" class="btn btn-danger"><i class="fas fa-trash-can pe-1"></i>Delete</button></td>
      </tr>
    `;
  }

  bookmarkList.innerHTML = cartona;
}

function deleteBookmark(index) {
  Swal.fire({
    title: "Do you want to delete this bookmark?",
    showCancelButton: true,
    confirmButtonText: "Delete",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Bookmark deleted!", "", "success");
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      displayBookmarks();
    } else if (result.isDenied) {
      displayBookmarks();
    }
  });
}

siteName.addEventListener("input", function () {
  validateForm(siteName);
});

siteUrl.addEventListener("input", function () {
  validateForm(siteUrl);
});

function validateForm(element) {
  const regex = {
    siteName: /^[A-Z][a-z]{3,10}$/,
    siteUrl:
      /^https?:\/\/(www\.)?[\w.-]+\.[a-z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
  };

  const isValid = regex[element.id].test(element.value.trim());

  const messageElement = element.id === "siteName" ? messageName : messageUrl;

  if (isValid) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    messageElement.classList.add("d-none");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    messageElement.classList.remove("d-none");
  }

  return isValid;
}

search.addEventListener("input", function (e) {
  let term = search.value;
  cartona = "";
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].name.toLowerCase().includes(term.toLowerCase())) {
      bookmarks[i].highlighted = bookmarks[i].name.replaceAll(
        term,
        `<span class="text-danger">${term}</span>`
      );

      cartona += `
            <tr>
               <td>${i + 1}</td>
               <td>${bookmarks[i].highlighted}</td>
               <td><a href="${
                 bookmarks[i].url
               }" target="_blank" class="btn btn-success"><i class="fas fa-eye pe-1"></i>Visit</a></td>
               <td><button onclick="deleteBookmark(${i})" class="btn btn-danger"><i class="fas fa-trash-can pe-1"></i>Delete</button></td>
            </tr>
         `;
      bookmarkList.innerHTML = cartona;
    }
  }
});
