{
  const divTweets = document.querySelector("#lista-tweets");
  const formulario = document.querySelector("#formulario");

  let tweets = [];

  eventosTweets();
  function eventosTweets() {
    formulario.addEventListener("submit", agregarTweet);

    document.addEventListener("DOMContentLoaded", () => {
        tweets = JSON.parse( localStorage.getItem('tweets') ) || [];
        
        crearHTML()
        console.log(tweets);
    });
  }

  function agregarTweet(e) {
    e.preventDefault();

    const tweet = document.querySelector("#tweet").value;
    if (tweet === "") {
      alert("El tweet no puede estar vacio");
      return;
    }

    const tweetObj = {
      id: Date.now(),
      tweet, // es igual a tweet: tweet
    };

    tweets = [...tweets, tweetObj];
    crearHTML();
    formulario.reset();
    //agregamos al localStore
    sincronizarLocalStore();
  }

  function crearHTML() {
    limpiarHtml();

    if (tweets.length > 0) {
        //Mostrar los primero los ultimos elementos creados con sort()
      tweets.sort( (a, b) => b.id - a.id ).forEach((tweet) => {
        const btneliminar = document.createElement('a')
        btneliminar.classList.add('borrar-tweet');
        btneliminar.textContent = 'X';
        btneliminar.onclick = () => {
            borrarTweet(tweet.id);
        };

        const parrafoTweet = document.createElement("li");
        parrafoTweet.textContent = tweet.tweet;

        parrafoTweet.appendChild(btneliminar);
        divTweets.appendChild(parrafoTweet);
      });
    }
    
    //Actualizamos el localStore con los datos eliminados o creados
    sincronizarLocalStore()
  }

  function borrarTweet(id) {
    tweets = tweets.filter( tweet => tweet.id !== id);

    crearHTML();
  }

  function limpiarHtml() {
    while (divTweets.firstChild) {
      divTweets.removeChild(divTweets.firstChild);
    }
  }

  function sincronizarLocalStore() {
    localStorage.setItem("tweets", JSON.stringify(tweets));
  }
}
