document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyFormContainer = document.querySelector(".container");
  const addBtn = document.querySelector("#new-toy-btn");
  const addToyForm = document.querySelector(".add-toy-form");

  let addToy = false;

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToyCard(toy);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));

  addToyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(response => response.json())
      .then(newToy => {
        renderToyCard(newToy);
        addToyForm.reset();
        toyFormContainer.style.display = "none";
      })
      .catch(error => console.error('Error adding new toy:', error));
  });

  function renderToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.classList.add("card");

    const toyName = document.createElement("h2");
    toyName.textContent = toy.name;

    const toyImage = document.createElement("img");
    toyImage.src = toy.image;
    toyImage.alt = toy.name;
    toyImage.classList.add("toy-avatar");

    const toyLikes = document.createElement("p");
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.id = toy.id;
    likeButton.textContent = "Like ❤️";

    likeButton.addEventListener("click", () => {
      const newLikes = toy.likes + 1;
      
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          toyLikes.textContent = `${toy.likes} Likes`;
        })
        .catch(error => console.error('Error updating toy likes:', error));
    });

    toyCard.appendChild(toyName);
    toyCard.appendChild(toyImage);
    toyCard.appendChild(toyLikes);
    toyCard.appendChild(likeButton);

    toyCollection.appendChild(toyCard);
  }
});
