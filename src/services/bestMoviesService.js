import supabase from "./supabase";

export async function fetchBestMovies() {
  let { data: bestMovies, error } = await supabase
    .from("bestMovies")
    .select("*");
  return bestMovies;
}

export async function insertToBest(movie) {
  const { data, error } = await supabase
    .from("bestMovies")
    .insert([{ content: movie, imdbId: movie.imdbId }])
    .select();
}

export async function deleteBest(imdbId) {
  const { error } = await supabase
    .from("bestMovies")
    .delete()
    .eq("imdbId", imdbId);
}
