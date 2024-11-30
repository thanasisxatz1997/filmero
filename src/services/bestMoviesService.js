import supabase from "./supabase";

export async function fetchBestMovies() {
  let { data: bestMovies, error } = await supabase
    .from("bestMovies")
    .select("*");
  console.log(error);
  return bestMovies;
}

export async function insertToBest(movie) {
  const { data, error } = await supabase
    .from("bestMovies")
    .insert([{ content: movie, imdbId: movie.imdbId }])
    .select();
  console.log(data, error);
}

export async function deleteBest(imdbId) {
  const { error } = await supabase
    .from("bestMovies")
    .delete()
    .eq("imdbId", imdbId);
  console.log(error);
}
