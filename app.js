const input = document.querySelector("input");
// input.addEventListener("input", updateValue);
const loadingIndicator = document.getElementById("loading");
const suggestionBox = document.getElementById("suggestionBox");
const infoBox = document.getElementById("infoBoxes")
let debounceTimer;

input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer); // Clear any previously set timer
    loadingIndicator.style.display = "block";
    debounceTimer = setTimeout(() => {
        updateValue(e); // Call the function after 2 seconds
        loadingIndicator.style.display = "none"; // Hide loading indicator
    }, 2000); // 2000 milliseconds = 2 seconds
});
function updateValue(e) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmMwYmIxNDViOGY0YjQ3MmIxZDAzNTgxNjhmNWY3YyIsIm5iZiI6MTczMjU2MjIxNy44MzEzODAxLCJzdWIiOiI2MDlhOTYxMTI3OTBiZjAwM2IyNGEzZDUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.onmsUKp0LadJGfMzJZTKQZiB_Gyyn9B3tPUv7M7ktDA'
        }
    };
    
    const query = e.target.value;
    if (!query.trim()) {
        // suggestionBox.innerHTML = ""; // Clear suggestions if input is empty
        infoBox.innerHTML = ""; // Clear suggestions if input is empty
        
        return;
    }

    

    fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`, options)
        .then(res => res.json())
        .then(data => {
            const results = data.results || [];
            console.log(results)

                // suggestionBox.innerHTML = ""; // Clear previous suggestions
                infoBox.innerHTML = ""; // Clear suggestions if input is empty

                // Filter out "person" media_type
               const filteredResults = results.filter(item => item.media_type !== "person");

               filteredResults.forEach(item => {
                // const suggestion = document.createElement("div");
                // suggestion.classList.add("suggestion-item");
                // suggestion.textContent = item.name || item.title || "Unknown"; // Use name or title
                // suggestionBox.appendChild(suggestion);
            
                
                const info = document.createElement("div");
                info.classList.add("box");
                info.textContent = item.name || item.title || "Unknown"; // Use name or title
                infoBox.appendChild(info);

            
                // Append Image
                if (item.poster_path) { // Check if an image path exists
                    const image = document.createElement("img");
                    image.classList.add("infoimg");
                    image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`; // Set full image URL
                    image.alt = item.name || item.title || "Image"; // Add alt text
                    info.appendChild(image);
                }else  {
                    const image = document.createElement("img");
                    image.classList.add("infoimg");
                    image.src = "https://images.unsplash.com/photo-1613679074971-91fc27180061?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    image.alt = item.name || item.title || "Image"; // Add alt text
                    info.appendChild(image);
                }

                //rating with how many voters
                if (item.vote_average) {
                    const vote = document.createElement("div");
                    vote.classList.add("voteavg");
                    vote.textContent = `Vote avg ${item.vote_average}`
                    info.appendChild(vote)
                } else {
                    const vote = document.createElement("div");
                    vote.classList.add("voteavg");
                    vote.textContent = "no avg"
                    info.appendChild(vote)
                }
                let mediaType = item.media_type;
                let movieId = item.id

                    fetch(`https://api.themoviedb.org/3/${mediaType}/${movieId}/watch/providers`, options)
                    .then(res => res.json())
                    .then(res => {
                        const resultsm = res.results?.US?.flatrate[0] || [];
                        const resultsBuy = res.results?.US?.buy[0] || [];
                        console.log(resultsm, "hey")

                                    
                        // Append flatrate img
                if (resultsm.logo_path) { // Check if an image path exists
                    const provider = document.createElement("img");
                    provider.classList.add("providerimg");
                    provider.src = `https://image.tmdb.org/t/p/w500${resultsm.logo_path}`; // Set full image URL
                    provider.alt = resultsm.provider_name || resultsm.provider_name || "Image"; // Add alt text
                    info.appendChild(provider);
                }else  {
                    const provider = document.createElement("span");
                    provider.classList.add("infoimgspan");
                    provider.textContent = "no flatrate providers"
                    info.appendChild(provider);
                }
                      // Append buy img
                if (resultsBuy.logo_path) { // Check if an image path exists
                    const providerb = document.createElement("img");
                    providerb.classList.add("providerimg");
                    providerb.src = `https://image.tmdb.org/t/p/w500${resultsBuy.logo_path}`; // Set full image URL
                    providerb.alt = resultsBuy.provider_name || resultsBuy.provider_name || "Image"; // Add alt text
                    info.appendChild(providerb);
                }else  {
                    const providerb = document.createElement("span");
                    providerb.classList.add("infoimgspan");
                    providerb.textContent = "no buying providers"
                    info.appendChild(providerb);
                }

                    })
                    .catch(err => console.error(err));


                    
                
              
               

            });
      
        })
        .catch(err => console.error(err));

  

}
