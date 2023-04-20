export default function (){
  const snippet = document.getElementById("cio-tracker")?.outerHTML;
  if (snippet) {
    let showSnippet = document.querySelector(".show-snippet");
    document.querySelector(".show-snippet-text").innerText = "Current JS snippet configuration";
    showSnippet.innerText = `${snippet}`.replace('async=""','async').replaceAll(" ","\n  ").replace(">","\n  >");
    showSnippet.classList.add("p-8");
  }
}