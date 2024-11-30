import supabase from "./supabase";

export async function fetchWatchedMovies() {
  let { data: watched } = await supabase.from("watched").select("*");
  return watched;
}

export async function insertToWatched(movie) {
  console.log("trying to insert", movie);
  const { data } = await supabase
    .from("watched")
    .insert([{ content: movie, imdbId: movie.imdbId }])
    .select();
  console.log(data);
}

export async function deleteWatched(imdbId) {
  const { error } = await supabase
    .from("watched")
    .delete()
    .eq("imdbId", imdbId);
  console.log(error);
}
