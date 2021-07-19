window._gaq = [["_setAccount", "UA-33711406-1"], ["_trackPageview"]];

fetch("https://emergencykitten-api.herokuapp.com/")
  .then((res) => res.json())
  .then((kittens) => {
    const kitten = kittens[Math.floor(Math.random() * kittens.length)];
    const image = document.createElement("img");
    const link = document.createElement("a");

    link.className = "kitten";
    link.href = kitten.url;

    image.alt = kitten.imageAlt;
    image.className = "kitten-image";
    image.src = kitten.imageUrl;

    link.appendChild(image);
    document.getElementById("putakitteninme").appendChild(link);
  });
