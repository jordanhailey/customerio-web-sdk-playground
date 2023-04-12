export default function (){
  let showSnippet = document.querySelector(".show-snippet");
  document.querySelector(".show-snippet-text").innerText = "Your current JS snippet configuration";
  showSnippet.innerText = `${document.getElementById("cio-tracker").outerHTML}`.replace('async=""','async').replaceAll(" ","\n  ").replace(">\x3C",">\n<");
  showSnippet.classList.add("p-8");
}